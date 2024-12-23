import { fetchImageAndInsertInDbAsync } from '../lib/fetchImageAndSaveProductTask';
import { parseAndStreamCsvFromPath } from '../lib/parseAndStreamCsvFromPath';
import { IUploadResponse } from '../types/api';
import { basename, join } from 'path';
export class ProductUploadController {
  static async handle(filePath: string): Promise<IUploadResponse> {
    // start parsing the csv
    let csvStream = null;
    try {
      csvStream = parseAndStreamCsvFromPath(filePath);
    } catch (error) {
      return {
        success: false,
        message: 'Error parsing csv file ' + basename(filePath),
      };
    }

    // for every row of csv. async fetch the image and save in db.
    const tasksInProgress: Promise<boolean | Error>[] = [];
    // Break the csv to 5 rows per batch?

    for await (const row of csvStream) {
      const { sku, name, description, category, price, image: imageUrl } = row;
      const task = fetchImageAndInsertInDbAsync(sku, name, description, category, price, imageUrl);
      tasksInProgress.push(task);
    }

    let result = await Promise.allSettled(tasksInProgress);
    result.map((resOrErr) => {
      if (resOrErr.status == 'fulfilled') {
        console.log(resOrErr.value);
      } else {
        console.error(resOrErr.reason);
      }
    });

    return {
      success: true,
      message: filePath,
    };
  }
}
