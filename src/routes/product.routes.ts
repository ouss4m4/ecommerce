import { Request, Response, Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const productRouter = Router();

// API ROUTES
productRouter.get('/', async (req: Request, res: Response) => {
  try {
    let data = await ProductController.getProductList();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    let message = 'An unexpected error happened';
    if (error instanceof Error) {
      message = error.message;
    }
    res.status(400).json({
      success: false,
      message,
    });
  }
});

productRouter.post('/', async (req: Request, res: Response) => {
  try {
    let data = await ProductController.createProduct(req.body);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    let message = 'An unexpected error happened';
    if (error instanceof Error) {
      message = error.message;
    }
    res.status(400).json({
      success: false,
      message,
    });
  }
});

export { productRouter };
