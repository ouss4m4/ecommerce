import { kafkaClient } from './client';
import { productCreatedConsumer } from './consumers/ProductCreated.consumer';
import { productUpdatedConsumer } from './consumers/ProductUpdated.consumer';
import { productUploadedConsumer } from './consumers/ProductUploaded.consumer';
import { productCreatedProducer } from './producers/ProductCreated.producer';
import { productUpdatedProducer } from './producers/ProductUpdated.producer';
import { productUploadedProducer } from './producers/ProductUploaded.producer';

const initialiseKafkaConsumersAndProducers = async () => {
  productCreatedProducer.connect();
  productUpdatedProducer.connect();
  productUploadedProducer.connect();
  productCreatedConsumer.connectAndSubscribe();
  productUpdatedConsumer.connectAndSubscribe();
  productUploadedConsumer.connectAndSubscribe();
};
export {
  kafkaClient,
  productCreatedConsumer,
  productCreatedProducer,
  productUpdatedConsumer,
  productUpdatedProducer,
  productUploadedConsumer,
  productUploadedProducer,
  initialiseKafkaConsumersAndProducers,
};
