import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import { basename } from 'path';
import { redisClient } from '../cache/redis';
import { logger } from '../logger';
import { copyExistingImageInStorage } from './copyExistingImageInStorage';

export const downloadExternalImageAndSaveToDisk = async (url: string, filePath: string): Promise<string> => {
  // let controller = new AbortController();
  // const signal = controller.signal;
  // setTimeout(() => {
  //   controller.abort();
  // }, 5000);
  // TODO: add a timeout abortSignal

  let cachedImage = await redisClient.get(url);
  if (cachedImage) {
    logger.info(`--- img found in cache -- \n ${cachedImage} -- \n should be copied to ${filePath} `);
    copyExistingImageInStorage(cachedImage, filePath);
    return cachedImage;
  }
  let response = await fetch(url).catch((err) => {
    throw new Error(`${err.message} | ${basename(filePath)}`);
  });

  if (!response.ok || !response.body) {
    throw new Error('Failed to fetch Image ' + url);
  }

  try {
    let writer = createWriteStream(filePath);
    await pipeline(response.body as any, writer);
    redisClient.set(url, filePath, 'EX', 120);
    return filePath;
  } catch (error) {
    let message = 'Error while saving image';

    if (error instanceof Error) {
      message = error.message;
    }

    throw new Error(`${message} | ${url} | ${basename(filePath)}`);
  }
};
