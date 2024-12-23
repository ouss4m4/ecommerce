import { Request, Response, Router } from "express";
import { fileUpload } from "../middlewares/fileupload.middleware";

const uploadRouter = Router();

uploadRouter.post(
  "/",
  fileUpload.single("items"),
  (req: Request, res: Response) => {
    // file uploaded without error.
    console.log(req.file);

    res.sendStatus(200);
  }
);

export { uploadRouter };
