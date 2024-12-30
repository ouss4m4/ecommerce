import { kafkaClient } from './client';
import { productCreatedConsumer } from './consumers/ProductCreated.consumer';
import { productUpdatedConsumer } from './consumers/ProductUpdated.consumer';
import { productCreatedProducer } from './producers/ProductCreated.producer';
import { productUpdatedProducer } from './producers/ProductUpdated.producer';

const initialiseKafkaConsumersAndProducers = async () => {
  productCreatedProducer.connect();
  productUpdatedProducer.connect();
  productCreatedConsumer.connectAndSubscribe();
  productUpdatedConsumer.connectAndSubscribe();
};
export {
  kafkaClient,
  productCreatedConsumer,
  productCreatedProducer,
  productUpdatedConsumer,
  productUpdatedProducer,
  initialiseKafkaConsumersAndProducers,
};
