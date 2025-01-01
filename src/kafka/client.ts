import { Kafka, KafkaConfig, LogEntry } from 'kafkajs';
import { logger } from '../logger';

const kafkaOptions: KafkaConfig = {
  brokers: ['localhost:9092'],
  logCreator:
    () =>
    ({ log }) => {
      logger.log({ level: 'kafka', message: log.message });
    },
};
const kafkaClient = new Kafka(kafkaOptions);

export { kafkaClient };
