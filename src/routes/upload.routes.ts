import { Request, Response, Router } from 'express';
import { fileUpload } from '../middlewares/fileupload.middleware';
import { ProductUploadController } from '../controllers/upload.controller';
import { IUploadResponse } from '../types/api';

const uploadRouter = Router();

uploadRouter.post('/', fileUpload.single('items'), async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.json({
      success: false,
      message: 'File upload failed',
    });
    return;
  }

  try {
    const result: IUploadResponse = await ProductUploadController.handle(req.file.path);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export { uploadRouter };
