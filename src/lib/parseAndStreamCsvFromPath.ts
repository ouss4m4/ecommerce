import { createReadStream } from 'fs';
import { parse } from 'fast-csv';

export const parseAndStreamCsvFromPath = (filePath: string) => {
  return createReadStream(filePath).pipe(parse({ headers: true, delimiter: ',', quote: "'" }));
};
