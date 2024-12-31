import { Request, Response } from 'express';
import { IBatchProductInsertResponse, IProductDTO } from '../types/api';
import { AppDataSource } from '../db';
import { Product } from '../entities/product.entity';

const productRepo = AppDataSource.getRepository(Product);

export const batchInsertProducts = async (products: IProductDTO[]): Promise<IBatchProductInsertResponse> => {
  const response: IBatchProductInsertResponse = {
    success: 0,
    errors: [],
  };
  try {
    // await productRepo.insert(products);
    await productRepo.upsert(products, {
      conflictPaths: ['sku'],
    });
    response.success = products.length;
    return response;
  } catch (error) {
    return await insertOneByOne(products);
  }
};

const insertOneByOne = async (products: IProductDTO[]): Promise<IBatchProductInsertResponse> => {
  const response: IBatchProductInsertResponse = {
    success: 0,
    errors: [],
  };
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    try {
      await productRepo.upsert(product, { conflictPaths: ['sku'] });
      response.success += 1;
    } catch (err: any) {
      response.errors.push(`${err?.message ?? 'failed to insert in db '} | ${product.sku}`);
    }
  }

  return response;
};
