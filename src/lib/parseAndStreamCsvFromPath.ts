import { createReadStream } from 'fs';
import { CsvParserStream, parse } from 'fast-csv';

export const parseAndStreamCsvFromPath = (filePath: string) => {
  try {
    return createReadStream(filePath).pipe(parse({ headers: true }));
  } catch (error) {
    let message = 'parsing csv file failed';
    if (error instanceof Error) {
      message = error.message;
    }
    throw new Error(message);
  }
};
