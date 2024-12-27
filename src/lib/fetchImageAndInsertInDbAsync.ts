import { join } from 'path';
import { downloadExternalImageAndSaveToDisk } from './downloadExternalImageAndSaveToDisk';
import { AppDataSource } from '../db';
import { Product } from '../entities/product.entity';

export const fetchImageAndInsertInDbAsync = async (
  sku: string,
  name: string,
  description: string,
  categoryId: number,
  price: number,
  imageUrl: string
): Promise<boolean | Error> => {
  const productRepo = AppDataSource.getRepository(Product);
  try {
    let filePath = join(__dirname, '..', 'storage', `${sku}.png`);
    await downloadExternalImageAndSaveToDisk(imageUrl, filePath);
    // later on delegate this to be the return value of the promise.
    // and insert items at once
    await productRepo.insert({
      sku,
      name,
      description,
      categoryId,
      price,
      image: `\\images\\${sku}.png`,
    });
    return true;
  } catch (error) {
    let message = `Error happend inserting product ${sku}`;
    if (error instanceof Error) message = error.message;
    return new Error(message);
  }
};
