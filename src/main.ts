import { startServer } from './app';
import { connectDb } from './db';
// import { setupBullBoard } from './jobs/bullboard.job';
// import { setupBullMq } from './jobs/workers.job';
import { initialiseKafkaConsumersAndProducers } from './kafka';

connectDb();
startServer();
// setupBullMq();
// setupBullBoard();

initialiseKafkaConsumersAndProducers();
