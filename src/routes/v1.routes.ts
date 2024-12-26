import { Router } from 'express';
import { productRouter } from './product.routes';
import { uploadRouter } from './upload.routes';

const v1Router = Router();

v1Router.use('/products', productRouter);
v1Router.use('/upload', uploadRouter);

export { v1Router };
