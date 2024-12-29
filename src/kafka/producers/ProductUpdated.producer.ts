import { Message } from 'kafkajs';
import { kafkaClient } from '../client';

class ProductUpdatedProducer {
  private producer = kafkaClient.producer();

  async connect() {
    return this.producer.connect();
  }

  async sendMessage(message: Message) {
    await this.producer.send({
      topic: 'product.updated',
      messages: [message],
    });
  }

  async disconnect() {
    return this.producer.disconnect();
  }
}

const productUpdatedProducer = new ProductUpdatedProducer();
export { productUpdatedProducer };
