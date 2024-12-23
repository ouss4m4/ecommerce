import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';

export const downloadExternalImageAndSaveIt = async (url: string, filePath: string): Promise<string | Error> => {
  console.log('downloading ', url);
  let response = await fetch(url);
  if (!response.ok || !response.body) {
    console.error('wtf');
    throw new Error('Failed to fetch Image ' + filePath);
  }

  try {
    let writer = createWriteStream(filePath);
    await pipeline(response.body as any, writer);
    return filePath;
  } catch (error) {
    let message = 'Error while saving image ' + filePath;

    if (error instanceof Error) {
      message = error.message;
    }
    console.log(error);

    throw new Error(message);
  }
};
