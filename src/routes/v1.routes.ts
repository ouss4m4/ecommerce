import { Router } from 'express';
import { productRouter } from './product.routes';
import { categoryRouter } from './category.routes';
import { uploadRouter } from './upload.routes';
import { streamRouter } from './stream.routes';

const v1Router = Router();

v1Router.use('/products', productRouter);
v1Router.use('/categories', categoryRouter);
v1Router.use('/upload', uploadRouter);
v1Router.use('/stream', streamRouter);

export { v1Router };
