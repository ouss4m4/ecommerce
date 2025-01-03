import { startServer } from './app';
import { redisClient } from './cache/redis';
import { connectDb } from './db';
// import { setupBullBoard } from './jobs/bullboard.job';
// import { setupBullMq } from './jobs/workers.job';
import { initialiseKafkaConsumersAndProducers } from './kafka';

connectDb();
startServer();
// setupBullMq();
// setupBullBoard();
redisClient.set('startTime', Date.now());
initialiseKafkaConsumersAndProducers();
