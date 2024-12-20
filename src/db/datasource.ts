import { DataSourceOptions } from "typeorm";
import { config } from "dotenv";
import { Product } from "../entities/product.entity";

config();

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: `${process.env.DB_PASSWORD}`,
  database: process.env.DB_NAME,
  entities: [Product],
  migrations: ["dist/db/migrations/*.js"],
  synchronize: true,
  logging: false,
};
