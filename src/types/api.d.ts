import { Product } from '../entities/product.entity';

export interface IUploadResponse {
  success: boolean;
  message: string;
  errors: any[];
}

export interface IProductDTO {
  sku: string;
  name: string;
  description: string;
  categoryId: number;
  price: number;
  image: string;
}

export type UpdateProductDTO = Partial<Product>;

export type IBatchDownloadImagesSuccess = {
  sku: string;
  name: string;
  description: string;
  categoryId: number;
  price: number;
  image: string;
};

export type IBatchDownloadImagesResponse = {
  success: IBatchDownloadImagesSuccess[];
  errors: string[];
};

export type IBatchProductInsertResponse = {
  success: number;
  errors: string[];
};
