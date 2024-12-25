import { ExpressAdapter } from '@bull-board/express';
import { app } from '../app';
import { createBullBoard } from '@bull-board/api';
import { ingestElasticQueue } from './queues.job';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/ui');

app.use('/ui', serverAdapter.getRouter());

export const setupBullBoard = () =>
  createBullBoard({
    queues: [new BullMQAdapter(ingestElasticQueue)],
    serverAdapter,
  });
