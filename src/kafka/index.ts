import { kafkaClient } from './client';
import { productCreatedConsumer } from './consumers/ProductCreated.consumer';
import { productUpdatedConsumer } from './consumers/ProductUpdated.consumer';
import { productCreatedProducer } from './producers/ProductCreated.producer';
import { productUpdatedProducer } from './producers/ProductUpdated.producer';

const initialiseKafkaConsumersAndProducers = async () => {
  await productCreatedProducer.connect();
  await productUpdatedProducer.connect();
  await productCreatedConsumer.connectAndSubscribe();
  await productUpdatedConsumer.connectAndSubscribe();
};
export {
  kafkaClient,
  productCreatedConsumer,
  productCreatedProducer,
  productUpdatedConsumer,
  productUpdatedProducer,
  initialiseKafkaConsumersAndProducers,
};
