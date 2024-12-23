import "reflect-metadata";

import express, { json } from "express";
import { config } from "dotenv";
import { productRouter } from "./routes/product.routes";
import { uploadRouter } from "./routes/upload.routes";

config();

const app = express();
const port = process.env.PORT || "3002";

app.use(json());

app.use("/products", productRouter);

app.use("/upload", uploadRouter);
const startServer = () => {
  app.listen(port, function () {
    console.info("App is listening on port ", port);
  });
};

export { startServer };
