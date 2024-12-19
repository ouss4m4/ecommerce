import { DataSource } from "typeorm";
import { dataSourceOptions } from "./datasource";

const AppDataSource = new DataSource(dataSourceOptions);

// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap

export const connectDb = () =>
  AppDataSource.initialize()
    .then(() => {
      console.log("DB connected ");
    })
    .catch(console.error);
