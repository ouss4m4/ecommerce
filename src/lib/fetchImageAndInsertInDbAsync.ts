import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';

export const downloadExternalImageAndSaveToDisk = async (url: string, filePath: string): Promise<string | Error> => {
  let response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error('Failed to fetch Image ' + url);
  }

  try {
    // check storage folder (repetetive... omit for now)
    // await mkdir(storageFolder, { recursive: true });

    // extract filename (image)
    let writer = createWriteStream(filePath);
    await pipeline(response.body as any, writer);
    return filePath;
  } catch (error) {
    let message = 'Error while saving image ' + url;

    if (error instanceof Error) {
      message = error.message;
    }
    console.log(error);

    throw new Error(message);
  }
};
