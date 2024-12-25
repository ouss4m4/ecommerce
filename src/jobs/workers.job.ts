import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { config } from 'dotenv';
import { processIngestElastic } from '../jobsProcessors/ingestElastic.processor';
import { INGEST_ELASTIC_QUEUE_NAME } from '../constants';
config();

const connection = new IORedis({
  maxRetriesPerRequest: null,
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
});

connection.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export const setupBullMq = () => {
  if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
    throw new Error('Missing required Redis environment variables');
  }

  const ingestElasticJob = new Worker(INGEST_ELASTIC_QUEUE_NAME, processIngestElastic, { connection });

  ingestElasticJob.on('ready', () => {
    console.log(`Inject Elastic Worker Ready!`);
  });

  ingestElasticJob.on('completed', (job) => {
    console.log(`${job.id} has completed!`);
  });

  ingestElasticJob.on('failed', (job, err) => {
    console.log(`${job?.id} has failed with ${err.message}`);
  });

  // Handle graceful shutdown

  process.on('SIGINT', async () => {
    await ingestElasticJob.close();
    console.log('Workers shut down.');
    process.exit(0);
  });
};
