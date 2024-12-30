import { Request, Response } from 'express';
import { parseAndStreamCsvFromPath } from '../lib/parseAndStreamCsvFromPath';
import { basename } from 'path';
import { IUploadResponse } from '../types/api';
import { batchDownloadImages } from '../lib/batchDownloadImages';
import { batchInsertProducts } from '../lib/batchInsertProducts';
export class ProductBatchUploadController {
  //   static async handle(req: Request, res: Response): Promise<Response<IUploadResponse>> {
  static async handle(req: Request, res: Response): Promise<any> {
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
    let rowsBatch = [];
    let count = 0;

    for await (const row of csvStream) {
      rowsBatch.push(row);
      ++count;
      if (rowsBatch.length == 5) {
        // update progress
        uploadResult.message = `${count} rows in progress`;
        res.write(JSON.stringify(uploadResult));

        const { success: imgSuccess, errors: imgErrors } = await batchDownloadImages(rowsBatch);

        uploadResult.errors = uploadResult.errors.concat(imgErrors);
        const { success: insertSuccess, errors: insertErrors } = await batchInsertProducts(imgSuccess);

        uploadResult.errors = uploadResult.errors.concat(insertErrors);
        rowsBatch = [];
      }
    }
    res.end(JSON.stringify({ ...uploadResult, message: `Processed ${count - uploadResult.errors.length} successfully` }));
  }
}
