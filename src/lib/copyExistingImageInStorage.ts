import { copyFile } from 'fs';
import { logger } from '../logger';

export const copyExistingImageInStorage = (existingImg: string, destination: string) => {
  copyFile(existingImg, destination, function (err) {
    if (err) {
      return console.error(err.message);
    }
    logger.info(`${existingImg} copied as ${destination}`);
  });
};
