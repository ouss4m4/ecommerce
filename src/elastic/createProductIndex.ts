import { elasticClient } from '.';
/**
 * Run this through console not in app
 * node createProductIndex.ts
 */
const createIndex = async () => {
  // sku,name,description,categoryId,price,image,inStock,ratings,reviews,brand
  await elasticClient.indices.create({
    index: 'products',
    body: {
      mappings: {
        properties: {
          name: { type: 'text', analyzer: 'english' },
          description: { type: 'text', analyzer: 'english' },
          category: { type: 'text', analyzer: 'english', fields: { raw: { type: 'keyword' } } },
          price: { type: 'float' },
          inStock: { type: 'boolean' },
          ratings: { type: 'float' },
          reviews: { type: 'integer' },
          brand: { type: 'text' },
        },
      },
    },
  });
  console.log('Index created successfully!');
};

createIndex();
