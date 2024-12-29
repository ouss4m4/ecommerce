import { kafkaClient } from '../client';

class ProductUpdatedConsumer {
  private consumer = kafkaClient.consumer({ groupId: 'product-updated-notification-group' });

  async connectAndSubscribe() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'product.updated', fromBeginning: true });
    console.log('Consumer connected and listening to product.updated');

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log('Product updated event received:', message.value?.toString());
        // TODO: create the logic in different folder (separate from kafka context - reusable)
      },
    });
  }

  async disconnect() {
    await this.consumer.disconnect();
  }
}

// Singleton instance
const productUpdatedConsumer = new ProductUpdatedConsumer();
export { productUpdatedConsumer };
