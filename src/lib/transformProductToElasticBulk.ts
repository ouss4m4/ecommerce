import { Product } from '../entities/product.entity';
import { IProductDTO } from '../types/api';

/**
 * map a list of products to elastic search index bulk format
 *
 * { index: { _index: 'products', _id: product.sku } }
 * { sku, name, description, category, price, image }
 *
 * @param products
 * @returns Elastic Bulk Insert Format
 */
const transformToBulk = (products: Product[]): any[] => {
  const bulkData: ({ index: { _index: string; _id: string } } | IProductDTO)[] = [];

  for (const product of products) {
    // Metadata for the index operation
    bulkData.push({ index: { _index: 'products', _id: product.sku } });

    // Actual product data
    bulkData.push({
      sku: product.sku,
      name: product.name,
      description: product.description,
      categoryId: product.Category.id,
      category: product.Category.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
      inStock: product.inStock,
      ratings: product.ratings,
      reviews: product.reviews,
    });
  }

  return bulkData;
};

export { transformToBulk };
