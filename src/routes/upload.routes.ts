import { Request, Response, Router } from 'express';
import { fileUpload } from '../middlewares/fileupload.middleware';
import { ProductUploadController } from '../controllers/upload.controller';
import { IUploadResponse } from '../types/api';

const uploadRouter = Router();

uploadRouter.post('/', fileUpload.single('items'), (req: Request, res: Response): Promise<any> => ProductUploadController.handle(req, res));

export { uploadRouter };
