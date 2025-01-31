import { DataSource } from 'typeorm';
import { dataSourceOptions } from './dataSourceOptions';

export const AppDataSource = new DataSource(dataSourceOptions);

// exclude this from tests
export const connectDb = () =>
  AppDataSource.initialize()
    .then(() => {
      console.log('DB connected ');
    })
    .catch(console.error);
