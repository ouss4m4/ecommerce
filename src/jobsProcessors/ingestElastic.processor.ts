import { AppDataSource, connectDb } from '../db';
import { elasticClient } from '../elastic';
import { Product } from '../entities/product.entity';
import { transformToBulk } from '../lib/transformProductToElasticBulk';

export const processIngestElastic = async (job: any) => {
  try {
    let products = await AppDataSource.getRepository(Product).find({
      order: { id: 'DESC' },
      take: 2000,
    });

    let data = transformToBulk(products);

    let response = await elasticClient.bulk({ body: data });
    if (response.errors) {
      const erroredDocuments = response.items.filter((item) => item.index && item.index.error);

      console.error(`failed to index documents: ${erroredDocuments}`);
    }
    console.log(`Bulk indexing complete `, response);
  } catch (error) {
    let message = 'Injest process failed';
    if (error instanceof Error) {
      message = error.message;
    }
    console.error(new Error(message));
  }
};
