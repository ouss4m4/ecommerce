import { IBatchDownloadImagesResponse, IBatchDownloadImagesSuccess } from '../types/api';
import { join } from 'path';
import { downloadExternalImageAndSaveToDisk } from './downloadExternalImageAndSaveToDisk';

export const batchDownloadImages = async (rows: any[]): Promise<IBatchDownloadImagesResponse> => {
  let response: IBatchDownloadImagesResponse = {
    success: [],
    errors: [],
  };

  let imgDownloadProgress: Promise<string>[] = [];

  rows.forEach((row) => {
    const { sku, image: imageUrl } = row;
    let filePath = join(__dirname, '..', 'storage', `${sku}.png`);

    imgDownloadProgress.push(downloadExternalImageAndSaveToDisk(imageUrl, filePath));
  });

  const imgDownloadResult = await Promise.allSettled(imgDownloadProgress);

  imgDownloadResult.forEach((promiseResult, index) => {
    if (promiseResult.status == 'rejected') {
      response.errors.push(promiseResult.reason.message);
    } else {
      response.success.push({ ...rows[index], image: `/images/${rows[index]['sku']}.png` });
    }
  });

  return response;
};
