import { Request, Response } from 'express';
import { Product } from '../entities/product.entity';
import { AppDataSource } from '../db';
import { elasticClient } from '../elastic';
import { productCreatedProducer, productUpdatedProducer } from '../kafka';
import { UpdateProductDTO } from '../types/api';
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';

export interface CreateProductDTO {
  sku: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  image: string;
}

export interface ISearchProductsDTO {
  keyword?: string;
  category?: string;
  page?: number;
  size?: number;
  priceMin?: number;
  priceMax?: number;
  order?: string;
  sortby?: string;
  inStock?: boolean;
  brand?: string;
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

  static async searchProduct({
    category,
    keyword,
    priceMin,
    priceMax,
    sortby = 'ratings',
    order = 'desc',
    page = 1,
    size = 100,
    inStock,
    brand,
  }: ISearchProductsDTO) {
    try {
      const filters: any[] = [];
      const from = (page - 1) * size;

      if (category) {
        filters.push({ term: { 'category.raw': category } });
      }

      if (priceMin != undefined || priceMax != undefined) {
        let priceRange: Record<string, any> = { range: { price: {} } };
        if (priceMin && priceMin >= 0) {
          priceRange.range.price['gte'] = priceMin;
        }
        if (priceMax && priceMax > 0) {
          priceRange.range.price['lte'] = priceMax;
        }
        filters.push(priceRange);
      }

      if (inStock) {
        filters.push({ term: { inStock: true } });
      }

      let brandFilters: any[] = [];
      if (brand) {
        let brands = brand.split(',').map((name) => ({ term: { 'brand.raw': name } }));

        brandFilters.push({
          bool: {
            should: brands,
          },
        });
      }
      const sort: Record<string, string> = {};
      sort[sortby] = order;
      const query: QueryDslQueryContainer = keyword
        ? {
            bool: {
              must: [
                {
                  multi_match: {
                    query: keyword,
                    fields: ['name^5', 'brand^3', 'description'],
                    type: 'phrase',
                  },
                },
              ],
              filter: filters,
            },
          }
        : { bool: { filter: filters } };

      const Result = await elasticClient.search({
        index: 'products',
        body: {
          query: query,
          post_filter: {
            bool: {
              filter: brandFilters, // Reapply filters here to limit the final result set
            },
          },
          sort: [sort], // Sort by ratings in descending order
          aggs: {
            brand_counts: {
              terms: {
                field: 'brand.raw',
                size: 10,
              },
            },
            price_ranges: {
              range: {
                field: 'price',
                ranges: [{ to: 100 }, { from: 100, to: 500 }, { from: 500, to: 1000 }, { from: 1000 }],
              },
            },
          },
          from,
          size,
        },
      });
      return { data: Result.hits.hits.map((hit) => hit._source), aggs: Result.aggregations };
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }
}
