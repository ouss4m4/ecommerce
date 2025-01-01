import { ingestProductsBatches } from '../../elastic/ingestProductsBatches';
import { logger } from '../../logger';
import { kafkaClient } from '../client';

class ProductUploadedConsumer {
  private consumer = kafkaClient.consumer({ groupId: 'product-uploaded-notification-group' });

  async connectAndSubscribe() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'product.uploaded', fromBeginning: true });
    console.log('Consumer connected and listening to product.uploaded');

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        logger.log('kafka', `Product uploaded event received:  ${message.value?.toString()}`);
        if (!message.value) return;
        let skuStash: string[] = [];
        try {
          skuStash = JSON.parse(message.value.toString());
          ingestProductsBatches(skuStash);
        } catch (error) {
          console.error(error);
        }
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
