import { DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
// import from
config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: `${process.env.DB_PASSWORD}`,
  database: process.env.DB_NAME,
  entities: [Product, Category],
  // entities: [`${__dirname}/src/*.{j,t}s`],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: false,
  logging: true,
};
