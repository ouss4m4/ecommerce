import { Client } from '@elastic/elasticsearch';
import { config } from 'dotenv';
config();

const elasticClient = new Client({
  node: `http://localhost:${process.env.ELASTIC_PORT}`,
  auth: { username: `${process.env.ELASTIC_USER}`, password: `${process.env.ELASTIC_PASSWORD}` },
});

export { elasticClient };
