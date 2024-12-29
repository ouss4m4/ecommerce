import { Kafka, KafkaConfig } from 'kafkajs';

const kafkaOptions: KafkaConfig = {
  brokers: ['localhost:9092'],
};
const kafkaClient = new Kafka(kafkaOptions);

export { kafkaClient };
