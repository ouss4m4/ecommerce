import { Request, Response, Router } from "express";
import { ProductController } from "../controllers/product.controller";

const productRouter = Router();

// API ROUTES
productRouter.get("/", (req: Request, res: Response) => {
  try {
    let data = ProductController.getProductList();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    let message = "An unexpected error happened";
    if (error instanceof Error) {
      message = error.message;
    }
    res.status(400).json({
      success: false,
      message,
    });
  }
});

productRouter.post("/create", (req: Request, res: Response) => {
  try {
    let data = ProductController.createProduct();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    let message = "An unexpected error happened";
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
