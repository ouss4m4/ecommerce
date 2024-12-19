import Express, { application, Request, Response } from "express";
import "reflect-metadata";
import { connectDb } from "./db/setupDb";
import { config } from "dotenv";

config();
const app = Express();
const port = process.env.PORT || "3002";

app.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

connectDb();

app.listen(port, function () {
  console.info("App is listening on port ", port);
});
