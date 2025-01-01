import { In, Repository } from 'typeorm';
import { AppDataSource, connectDb } from '../db';
import { Product } from '../entities/product.entity';
import { transformToBulk } from '../lib/transformProductToElasticBulk';
import { elasticClient } from '.';
import { logger } from '../logger';

/**
 * Ingest in batches of 100
 * @param skuList list of SKU to ingest
 */
export const ingestProductsBatches = async (skuList: string[]) => {
  let batchSize = 10;
  if (!skuList || skuList.length == 0) return;
  const startTime = Date.now();
  logger.info(`products batch ingest: processing ${skuList.length}`);

  if (!AppDataSource.isInitialized) {
    await connectDb();
  }
  const productsRepo = AppDataSource.getRepository(Product);
  let batches = [];

  for (let index = 0; index < skuList.length; index += batchSize) {
    batches.push(skuList.slice(index, index + batchSize));
  }

  for (const batch of batches) {
    await fetchProductsAndMapToElastic(batch, productsRepo);
  }

  logger.info(`products batch ingest: finished in ${Date.now() - startTime} ms`);
};

const fetchProductsAndMapToElastic = async (batch: string[], repo: Repository<Product>) => {
  let products = await repo.find({
    where: { sku: In(batch) },
    relations: ['Category'],
  });
  try {
    // ingest 100 to elastic and proceed
    let ingestData = transformToBulk(products);
    let response = await elasticClient.bulk({ body: ingestData });
    if (response.errors) {
      const erroredDocuments = response.items.filter((item) => item.index && item.index.error);

      console.error(`failed to index documents: ${erroredDocuments}`);
    }
    console.log(`Bulk indexing complete `, response);
  } catch (error) {
    console.error(error);
  }
};
