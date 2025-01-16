import { Product } from '../entities/product.entity';

export interface IUploadResponse {
  success: boolean;
  message: string;
  errors: any[];
}

// sku,name,description,categoryId,price,image,inStock,ratings,reviews,brand
export interface IProductDTO {
  sku: string;
  name: string;
  description: string;
  categoryId: number;
  category?: string; // category name
  price: number;
  inStock: boolean;
  ratings: number;
  reviews: number;
  brand: string;
  image: string;
}

export type UpdateProductDTO = Partial<Product>;

export type IBatchDownloadImagesResponse = {
  success: IBatchDownloadImagesSuccess[];
  errors: string[];
};

export type IBatchProductInsertResponse = {
  success: number;
  errors: string[];
};
