import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import authRouter from "./routes/auth.routes.js";
import generalRouter from "./routes/general.routes.js";
import todoRouter from "./routes/todo.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import userRouter from "./routes/user.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.use("/tweets", tweetRouter);
app.use("/users", userRouter);
app.use("/todos", todoRouter);
app.use(authRouter);
app.use(generalRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
