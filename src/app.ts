import "reflect-metadata";

import express, { Request, Response } from "express";
import { connectDb } from "./db/setupDb";
import { config } from "dotenv";
import { join } from "path";
import { productRouter } from "./routes/product.routes";

config();

const app = express();
const port = process.env.PORT || "3002";

app.use(express.static(join(__dirname, "public")));

app.set("view engine", "pug");
app.set("views", join(__dirname, "views"));

app.get("/ping", (req: Request, res: Response) => {
  res.render("hello");
});

app.use("/product", productRouter);

connectDb();

app.listen(port, function () {
  console.info("App is listening on port ", port);
});
