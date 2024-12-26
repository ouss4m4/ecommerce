import 'reflect-metadata';

import express, { json, NextFunction, Request, Response } from 'express';
import { config } from 'dotenv';
import { v1Router } from './routes/v1.routes';
import { join } from 'path';
import cors from 'cors';

config();

const app = express();
const port = process.env.PORT || '3002';
app.use(cors());

app.use(json());
// API V1 routes
app.use('/api/v1', v1Router);

app.use(express.static(join(__dirname, 'public')));

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
