import { Request, Response } from "express";
import { AppDataSource } from "../db/setupDb";
import { Product } from "../entities/product.entity";

export class ProductController {
  static getProductList(): Promise<Product[]> {
    const productRepo = AppDataSource.getRepository(Product);

    return productRepo.find();
  }

  static createProduct() {
    throw new Error("method not imeplemented");
  }
}
