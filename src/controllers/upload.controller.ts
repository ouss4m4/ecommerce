import { downloadExternalImageAndSaveIt } from '../lib/downloadExternalImageAndSaveIt';
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

    // for every row of csv. fetch the image.
    for await (const row of csvStream) {
      await downloadExternalImageAndSaveIt(row['image'], join(__dirname, '..', 'storage/test.png'));
      break;
    }
    // { // row sample
    //   name: 'Smartphone X',
    //   description: 'High-performance smartphone.',
    //   category: 'phones',
    //   price: '699.99',
    //   image: 'https://picsum.photos/200/300'
    // }
    // save it in storage
    // get the storage link
    // create the item in the DB. with the local link as image

    return {
      success: true,
      message: filePath,
    };
  }
}
