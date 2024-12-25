import { elasticClient } from '.';
/**
 * Run this through console not in app
 * node createProductIndex.ts
 */
const createIndex = async () => {
  await elasticClient.indices.create({
    index: 'products',
    body: {
      mappings: {
        properties: {
          sku: { type: 'keyword' },
          name: {
            type: 'text',
            analyzer: 'standard',
            fields: { raw: { type: 'keyword' } },
          },
          description: { type: 'text', analyzer: 'standard' },
          category: { type: 'keyword' },
          price: { type: 'float' },
          image: { type: 'keyword' },
        },
      },
    },
  });
  console.log('Index created successfully!');
};

createIndex();
