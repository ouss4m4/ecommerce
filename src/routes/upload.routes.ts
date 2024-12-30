import { Request, Response, Router } from 'express';
import { fileUpload } from '../middlewares/fileupload.middleware';
import { ProductBatchUploadController } from '../controllers/upload.controller';
import { ProductUploadController } from '../controllers/uploadOld.controller';

const uploadRouter = Router();

uploadRouter.post('/', fileUpload.single('items'), (req: Request, res: Response): Promise<any> => ProductUploadController.handle(req, res));
uploadRouter.post(
  '/batches',
  fileUpload.single('items'),
  (req: Request, res: Response): Promise<any> => ProductBatchUploadController.handle(req, res)
);

export { uploadRouter };
