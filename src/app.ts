import 'reflect-metadata';

import express, { json, NextFunction, Request, Response } from 'express';
import { config } from 'dotenv';
import { productRouter } from './routes/product.routes';
import { uploadRouter } from './routes/upload.routes';

config();

const app = express();
const port = process.env.PORT || '3002';

app.use(json());

app.use('/products', productRouter);

app.use('/upload', uploadRouter);
const startServer = () => {
  app.listen(port, function () {
    console.info('App is listening on port ', port);
  });
};

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    let message = 'Unexcpected error happened';
    if (err instanceof Error) {
      message = err.message;
    }
    res.status(400).json({
      success: false,
      message,
    });
  }
});

export { app, startServer };
