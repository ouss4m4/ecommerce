import { Request, Response, Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const productRouter = Router();

// API ROUTES
productRouter.get('/', async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page ?? 0);
    const pageSize = Number(req.query.pageSize ?? 12);

    const { products, total } = await ProductController.getProductList({ limit: pageSize, skip: page * pageSize });

    res.status(200).json({
      success: true,
      data: products,
      page,
      pageSize,
      total,
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

productRouter.get('/search', async (req: Request, res: Response) => {
  let query = req.query;
  console.log(query);
  let items = await ProductController.searchProduct(query);
  res.json(items);
  return;
});

productRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    let data = await ProductController.getProduct(req.params.id);
    if (!data) {
      res.status(404).send();
      return;
    }
    res.status(200).json(data);
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

productRouter.patch('/:sku', async (req: Request, res: Response) => {
  try {
    let sku = req.params.sku;

    let data = await ProductController.updateProduct(sku, req.body);
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
