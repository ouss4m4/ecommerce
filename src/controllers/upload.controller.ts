import { Request, Response } from 'express';
import { fetchImageAndInsertInDbAsync } from '../lib/fetchImageAndInsertInDbAsync';
import { parseAndStreamCsvFromPath } from '../lib/parseAndStreamCsvFromPath';
import { IUploadResponse } from '../types/api';
import { basename } from 'path';
export class ProductUploadController {
  static async handle(req: Request, res: Response): Promise<Response<IUploadResponse>> {
    if (!req.file) {
      return res.json({
        success: false,
        message: 'File upload failed',
      });
    }

    let filePath = req.file.path;
    // start parsing the csv
    let csvStream = null;

    try {
      csvStream = parseAndStreamCsvFromPath(filePath);
    } catch (error) {
      return res.json({
        success: false,
        message: 'Error parsing csv file ' + basename(filePath),
      });
    }

    // for every row of csv. async fetch the image and save in db.
    const tasksInProgress: Promise<boolean | Error>[] = [];
    // TODO: Break the csv to 5 rows per batch?

    res.setHeader('content-type', 'application/json');
    res.write(
      JSON.stringify({
        success: true,
        message: 'processing...',
      })
    );

    let count = 0;
    for await (const row of csvStream) {
      const { sku, name, description, category, price, image: imageUrl } = row;
      const task = fetchImageAndInsertInDbAsync(sku, name, description, category, price, imageUrl);
      tasksInProgress.push(task);
      if (++count % 50 == 0) {
        res.write(
          JSON.stringify({
            success: true,
            message: `${count} rows in progress`,
          })
        );
      }
    }

    let successfullInserts = 0;
    let errors: string[] = [];

    (await Promise.allSettled(tasksInProgress)).map((resOrErr) => {
      if (resOrErr.status == 'fulfilled') {
        if (resOrErr.value instanceof Error) {
          console.log(resOrErr.value);
          errors = errors.concat(resOrErr.value.message);
        } else {
          ++successfullInserts;
        }
      }
    });

    return res.end(
      JSON.stringify({
        success: true,
        message: `Processed ${successfullInserts} Successfully`,
        errors,
      })
    );
  }
}
