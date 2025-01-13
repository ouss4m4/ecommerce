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
          name: { type: 'text', analyzer: 'english' },
          description: { type: 'text', analyzer: 'english' },
          category: { type: 'text', analyzer: 'english', fields: { raw: { type: 'keyword' } } },
        },
      },
    },
  });
  console.log('Index created successfully!');
};

createIndex();
