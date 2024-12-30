import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import { basename } from 'path';

export const downloadExternalImageAndSaveToDisk = async (url: string, filePath: string): Promise<string> => {
  // TODO: add a timeout abortSignal
  let response = await fetch(url).catch((err) => {
    throw new Error(`${err.message} | ${basename(filePath)}`);
  });

  if (!response.ok || !response.body) {
    throw new Error('Failed to fetch Image ' + url);
  }

  try {
    let writer = createWriteStream(filePath);
    await pipeline(response.body as any, writer);
    return filePath;
  } catch (error) {
    let message = 'Error while saving image';

    if (error instanceof Error) {
      message = error.message;
    }

    throw new Error(`${message} | ${url} | ${basename(filePath)}`);
  }
};
