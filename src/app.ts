import "reflect-metadata";

import express, { json } from "express";
import { connectDb } from "./db/setupDb";
import { config } from "dotenv";
import { productRouter } from "./routes/product.routes";

config();

const app = express();
const port = process.env.PORT || "3002";

app.use(json());

app.use("/product", productRouter);

connectDb();

app.listen(port, function () {
  console.info("App is listening on port ", port);
});
