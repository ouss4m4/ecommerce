import { Queue } from 'bullmq';
import { INGEST_ELASTIC_QUEUE_NAME } from '../constants';

export const ingestElasticQueue = new Queue(INGEST_ELASTIC_QUEUE_NAME);
