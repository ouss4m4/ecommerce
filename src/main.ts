import { startServer } from "./app";
import { connectDb } from "./db/setupDb";

connectDb();

startServer();
