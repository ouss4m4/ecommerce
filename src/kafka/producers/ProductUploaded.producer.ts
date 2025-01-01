import { Message } from 'kafkajs';
import { kafkaClient } from '../client';

class ProductUploadedProducer {
  private producer = kafkaClient.producer();

  async connect() {
    return this.producer.connect();
  }

  async sendMessage(message: Message) {
    await this.producer.send({
      topic: 'product.uploaded',
      messages: [message],
    });
  }

  async disconnect() {
    return this.producer.disconnect();
  }
}

const productUploadedProducer = new ProductUploadedProducer();
export { productUploadedProducer };
