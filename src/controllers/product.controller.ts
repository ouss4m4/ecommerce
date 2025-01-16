import { Request, Response } from 'express';
import { Product } from '../entities/product.entity';
import { AppDataSource } from '../db';
import { elasticClient } from '../elastic';
import { productCreatedProducer, productUpdatedProducer } from '../kafka';
import { UpdateProductDTO } from '../types/api';

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
    const { sku, categoryId, description = '', name = '', price = null, image = '' } = unsafeData;

    if (!sku || !name || !description || !Number(categoryId) || !price || !image) {
      throw new Error('missing fields');
    }
    const productRepo = AppDataSource.getRepository(Product);
    let product = await productRepo.save({
      sku,
      name,
      description,
      categoryId: +categoryId,
      price,
      image,
    });

    productCreatedProducer.sendMessage({
      value: JSON.stringify(product),
    });

    return product;
  }

  static async updateProduct(sku: string, data: UpdateProductDTO) {
    const productRepo = AppDataSource.getRepository(Product);
    let product = await productRepo.findOne({ where: { sku } });
    if (!product || !product.sku) {
      throw new Error('product not found');
    }
    // validation on data with joi
    const { name, description, categoryId, price } = data;

    const updatedProduct = await productRepo.update({ sku }, { name, description, categoryId, price });

    productUpdatedProducer.sendMessage({
      value: JSON.stringify(sku),
    });

    return updatedProduct;
  }
  static async searchProduct(searchTerm: string) {
    try {
      if (!searchTerm) {
        // Fetch latest  items when searchTerm is empty
        const defaultResult = await elasticClient.search({
          index: 'products',
          body: {
            query: {
              match_all: {},
            },
            size: 100,
          },
        });

        return defaultResult.hits.hits.map((hit) => hit._source);
      }
      const searchResult = await elasticClient.search({
        index: 'products',
        body: {
          query: {
            multi_match: {
              query: searchTerm,
              fields: ['name^5', 'brand^3', 'category^2', 'description'],
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
