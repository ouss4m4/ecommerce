import { Request, Response } from 'express';
import { parseAndStreamCsvFromPath } from '../lib/parseAndStreamCsvFromPath';
import { basename } from 'path';
import { IUploadResponse } from '../types/api';
import { batchDownloadImages } from '../lib/batchDownloadImages';
import { batchInsertProducts } from '../lib/batchInsertProducts';
import { productUploadedProducer } from '../kafka';
export class ProductBatchUploadController {
  //   static async handle(req: Request, res: Response): Promise<Response<IUploadResponse>> {
  static async handle(req: Request, res: Response): Promise<any> {
    const batchSize = 100;
    const skuStash = [];
    if (!req.file) {
      return res.json({
        success: false,
        message: 'File upload failed',
      });
    }

    let uploadResult: IUploadResponse = {
      success: true,
      message: 'Started processing rows',
      errors: [],
    };
    // start reading the csv from disk in a stream
    let filePath = req.file.path;
    let csvStream = null;

    try {
      // streamed from
      csvStream = parseAndStreamCsvFromPath(filePath);
    } catch (error) {
      return res.json({
        success: false,
        message: 'Error parsing csv file ' + basename(filePath),
      });
    }

    res.setHeader('content-type', 'application/json');
    res.write(JSON.stringify(uploadResult));

    // process rows in batches of 10
    let rowsBatch: any[] = [];
    let count = 0;

    const processBatch = async () => {
      // update progress
      uploadResult.message = `${count} rows in progress`;
      res.write(JSON.stringify(uploadResult));

      const { success: imgSuccess, errors: imgErrors } = await batchDownloadImages(rowsBatch);

      uploadResult.errors = uploadResult.errors.concat(imgErrors);
      const { success: rowsInserted, errors: insertErrors } = await batchInsertProducts(imgSuccess);
      console.log({ rowsInserted, insertErrors });
      count += rowsInserted;
      uploadResult.errors = uploadResult.errors.concat(insertErrors);
    };

    for await (const row of csvStream) {
      rowsBatch.push(row);
      skuStash.push(row['sku']);
      if (rowsBatch.length == batchSize) {
        await processBatch();
        rowsBatch = [];
      }
    }
    if (rowsBatch.length) {
      await processBatch();
    }
    productUploadedProducer.sendMessage({ value: JSON.stringify(skuStash) });
    res.end(JSON.stringify({ ...uploadResult, message: `Processed ${count} successfully` }));
  }
}
