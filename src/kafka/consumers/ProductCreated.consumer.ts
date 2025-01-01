import { logger } from '../../logger';
import { kafkaClient } from '../client';

class ProductCreatedConsumer {
  private consumer = kafkaClient.consumer({ groupId: 'product-created-notification-group' });

  async connectAndSubscribe() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'product.created', fromBeginning: true });
    console.log('Consumer connected and listening to product.created');

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log('Product created event received:', message.value?.toString());
        logger.log('kafka', `Event Received ${topic}`);
        // TODO: create the logic in different folder (separate from kafka context - reusable)
      },
    });
  }

  async disconnect() {
    await this.consumer.disconnect();
  }
}

// Singleton instance
const productCreatedConsumer = new ProductCreatedConsumer();
export { productCreatedConsumer };
