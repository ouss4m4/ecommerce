import { Product } from '../entities/product.entity';

export interface IUploadResponse {
  success: boolean;
  message: string;
  errors?: any[];
}

export type UpdateProductDTO = Partial<Product>;
