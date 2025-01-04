import { Request, Response } from 'express';
import { join } from 'path';
import { parseAndStreamCsvFromPath } from '../lib/parseAndStreamCsvFromPath';
import { IProductDTO, IUploadResponse } from '../types/api';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';
export class StreamController {
  static async broadcast(req: Request, res: Response) {
    let filePath = join(__dirname, '..', 'uploads/streamfile.csv');
    let csvStream = parseAndStreamCsvFromPath(filePath);

    res.setHeader('content-type', 'application/json');

    for await (const row of csvStream) {
      await new Promise((resolve) => setTimeout(() => resolve(''), 200));
      res.write(JSON.stringify(row));
      // break;
    }
    res.end();
  }

  static async listen(req: Request, res: Response) {
    let response = await fetch('http://localhost:3001/api/v1/stream/broadcast');
    if (!response.ok || !response.body) {
      console.log(response);
      res.send('interval server errro').status(500);
      return;
    }

    let reader = response.body.getReader();
    let decoder = new TextDecoder();
    let streamDone = false;
    while (!streamDone) {
      let { value, done } = await reader.read();
      streamDone = done;
      if (!value) continue;
      try {
        let row = JSON.parse(decoder.decode(value));
        this.processRow(row);
      } catch (error) {
        console.error(error);
      }
    }
    res.send('done');
  }
  static async processRow(row: IProductDTO) {
    fetch(row.image)
      .then((result) => {
        if (!result.ok || !result.body) {
          return new Error('Failed to fetch ' + row.sku);
        }
        let writeStream = createWriteStream(join(__dirname, '..', `storage/aaa-${row.sku}.png`));
        Readable.fromWeb(result.body as any).pipe(writeStream);
      })
      .catch(console.error);
  }
}
