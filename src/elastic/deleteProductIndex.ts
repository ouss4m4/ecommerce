import { elasticClient } from '.';
/**
 * Run this through console not in app
 * node deleteProductIndex.ts
 */
const createIndex = async () => {
  await elasticClient.indices.delete({
    index: 'products',
  });
  console.log('Index created successfully!');
};

createIndex();
