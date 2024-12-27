import { Request, Response, Router } from 'express';
import { CategoryController } from '../controllers/category.controller';

const categoryRouter = Router();

categoryRouter.get('/', async (req: Request, res: Response) => {
  try {
    const data = await CategoryController.getCategories();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: error,
    });
  }
});

categoryRouter.post('/', async (req: Request, res: Response) => {
  try {
    const data = await CategoryController.createCategory(req.body);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: error,
    });
  }
});

export { categoryRouter };
