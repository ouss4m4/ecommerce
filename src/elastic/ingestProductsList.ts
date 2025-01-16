import { elasticClient } from '.';
import { AppDataSource, connectDb } from '../db';
import { Product } from '../entities/product.entity';
import { transformToBulk } from '../lib/transformProductToElasticBulk';

export const ingestProductsList = async () => {
  await connectDb();
  // ingest product in batches of 100
  const dataSource = AppDataSource.getRepository(Product);

  let batch = 0;
  while (true) {
    const products = await dataSource.find({
      take: 100,
      skip: 100 * batch,
      relations: ['Category'],
    });

    if (products.length == 0) {
      console.error('no more products, batches done ' + batch);
      break;
    }
    ++batch;

    try {
      console.log(products.length);
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
  }

  process.exit(0);
};

ingestProductsList();
