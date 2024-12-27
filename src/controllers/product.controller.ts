import { Request, Response } from 'express';
import { Product } from '../entities/product.entity';
import { AppDataSource } from '../db';
import { elasticClient } from '../elastic';

export interface CreateProductDTO {
  sku: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  image: string;
}

export class ProductController {
  static async getProductList({ limit, skip }: { limit: number; skip: number }): Promise<{ products: Product[]; total: number }> {
    const productRepo = AppDataSource.getRepository(Product);
    let [products, total] = await productRepo.findAndCount({
      skip,
      take: limit,
    });
    return {
      products,
      total,
    };
  }

  static async getProduct(id: string): Promise<Product | null> {
    const productRepo = AppDataSource.getRepository(Product);

    const product = await productRepo.findOne({ where: { sku: id } });

    return product;
  }

  static async createProduct(unsafeData: CreateProductDTO) {
    // validation with joi here

    const { sku, categoryId, description = '', name = '', price = null, image = '' } = unsafeData;

    if (!sku || !name || !description || !Number(categoryId) || !price || !image) {
      throw new Error('missing fields');
    }
    const productRepo = AppDataSource.getRepository(Product);
    let product = await productRepo.insert({
      sku,
      name,
      description,
      categoryId: +categoryId,
      price,
      image,
    });

    return product;
  }

  static async searchProduct(searchTerm: string) {
    // load from elastic and respond
    try {
      const searchResult = await elasticClient.search({
        index: 'products',
        body: {
          query: {
            multi_match: {
              query: searchTerm,
              fields: ['name^3', 'description^2', 'category'],
              type: 'phrase',
            },
          },
        },
      });

      return searchResult.hits.hits.map((hit) => hit._source);
    } catch (error) {
      return [];
    }
  }
}
