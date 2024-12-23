import { Request, Response } from 'express';
import { AppDataSource } from '../db/setupDb';
import { Product } from '../entities/product.entity';

export interface CreateProductDTO {
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
}

export class ProductController {
  static async getProductList(): Promise<Product[]> {
    const productRepo = AppDataSource.getRepository(Product);

    return productRepo.find();
  }

  static async createProduct(unsafeData: CreateProductDTO) {
    // validation with joi here

    const { category = '', description = '', name = '', price = '', image = '' } = unsafeData;

    if (!name || !description || !category || !price || !image) {
      throw new Error('missing fields');
    }

    const productRepo = AppDataSource.getRepository(Product);
    let product = await productRepo.insert({
      name,
      description,
      category,
      price,
      image,
    });

    return product;
  }
}
