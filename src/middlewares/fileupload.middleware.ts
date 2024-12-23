import Multer, { diskStorage } from 'multer';
import { join } from 'path';

const storage = diskStorage({
  destination(req, file, cb) {
    cb(null, join(__dirname, '..', 'uploads'));
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.csv');
  },
});

const multer = Multer({
  storage,
  fileFilter(req, file, callback) {
    if (file.mimetype != 'text/csv') {
      callback(new Error('Only CSV upload permitted'));
    } else {
      callback(null, true);
    }
  },
});

export { multer as fileUpload };
