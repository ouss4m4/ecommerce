import { Request, Response } from 'express';
import { IBatchProductInsertResponse, IProductDTO } from '../types/api';
import { AppDataSource } from '../db';
import { Product } from '../entities/product.entity';

export const batchInsertProducts = async (products: IProductDTO[]): Promise<IBatchProductInsertResponse> => {
  let response: IBatchProductInsertResponse = {
    success: true,
    errors: [],
  };

  const productRepo = AppDataSource.getRepository(Product);
  try {
    await productRepo.insert(products);
    response.success = true;
    return response;
  } catch (error) {
    // TODO: if mass insert failts. default to one by one. and show the errored one
    let message = 'insert failed for product';
    if (error instanceof Error) {
      message = error.message;
    }
    response.errors.push(message);
    return response;
  }
};
