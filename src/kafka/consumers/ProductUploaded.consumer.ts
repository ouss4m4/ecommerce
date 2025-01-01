import { kafkaClient } from '../client';

class ProductUploadedConsumer {
  private consumer = kafkaClient.consumer({ groupId: 'product-uploaded-notification-group' });

  async connectAndSubscribe() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'product.uploaded', fromBeginning: true });
    console.log('Consumer connected and listening to product.uploaded');

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log('Product uploaded event received:', message.value?.toString());
        // TODO: create the logic in different folder (separate from kafka context - reusable)
      },
    });
  }

  async disconnect() {
    await this.consumer.disconnect();
  }
}

// Singleton instance
const productUploadedConsumer = new ProductUploadedConsumer();
export { productUploadedConsumer };
