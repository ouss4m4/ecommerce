import { Request, Response, Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const productRouter = Router();

// API ROUTES
productRouter.get('/', async (req: Request, res: Response) => {
  try {
    // extract query
    console.log(req.query.page);
    const page = Number(req.query.page ?? 1);
    const pageSize = Number(req.query.pageSize ?? 12);

    const data = await ProductController.getProductList({ limit: pageSize, skip: page * pageSize });

    res.status(200).json({
      success: true,
      data,
      page,
      pageSize,
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
  let query = req.query.query;
  console.log(query);
  if (!query) {
    res.status(400).send();
    return;
  }
  let result = await ProductController.searchProduct(query as string);
  let items = result.hits.hits?.map((item) => ({ ...(item._source as object) }));
  res.json(items ?? []);
  return;
});
productRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    let data = await ProductController.getProduct(req.params.id);
    if (!data) {
      res.status(404).send();
      return;
    }
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
