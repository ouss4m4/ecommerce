import { Message } from 'kafkajs';
import { kafkaClient } from '../client';

class ProductCreatedProducer {
  private producer = kafkaClient.producer();

  async connect() {
    return this.producer.connect();
  }

  async sendMessage(message: Message) {
    await this.producer.send({
      topic: 'product.created',
      messages: [message],
    });
  }

  async disconnect() {
    return this.producer.disconnect();
  }
}

const productCreatedProducer = new ProductCreatedProducer();
export { productCreatedProducer };
