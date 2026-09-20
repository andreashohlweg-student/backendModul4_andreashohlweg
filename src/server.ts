import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import type { Request, Response } from "express";

import tweetRouter from "./routes/tweet.routes.js";
import userRouter from "./routes/user.routes.js";
import todoRouter from "./routes/todo.routes.js";
import authRouter from "./routes/auth.routes.js";

import { errorHandler } from "./middleware/errorHandler.js";

import type {
  HealthResponse,
  GreetResponse,
} from "./types/common.js";

// --------------------------------------------------
// App Setup
// --------------------------------------------------

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());


// --------------------------------------------------
// Resource Routes
// --------------------------------------------------

app.use("/tweets", tweetRouter);
app.use("/users", userRouter);
app.use("/todos", todoRouter);
app.use(authRouter);


// --------------------------------------------------
// Allgemeine Routes
// --------------------------------------------------

app.get(
  "/echo",
  (_req: Request, res: Response) => {
    res.send("Echo");
  },
);


app.get(
  "/hello",
  (
    _req: Request,
    res: Response<HealthResponse>,
  ) => {
    res.status(200).json({
      success: true,
      message: "Syntax!",
      timestamp: new Date().toISOString(),
    });
  },
);


app.get(
  "/health",
  (
    _req: Request,
    res: Response<HealthResponse>,
  ) => {
    res.status(200).json({
      success: true,
      message: "Server is running",
      timestamp: new Date().toISOString(),
    });
  },
);


app.get(
  "/greet/:name",
  (
    req: Request<{ name: string }>,
    res: Response<GreetResponse>,
  ) => {
    const { name } = req.params;
    const lang = req.query.lang;

    const message =
      lang === "en"
        ? `Hello ${name}`
        : `Hallo ${name}`;

    res.json({ message });
  },
);


app.get(
  "/greet",
  (
    req: Request,
    res: Response<GreetResponse>,
  ) => {
    const name = req.query.name;
    const lang = req.query.lang;

    const message =
      lang === "en"
        ? `Hello ${name}`
        : `Hallo ${name}`;

    res.json({ message });
  },
);


// --------------------------------------------------
// Error Handling
// --------------------------------------------------

app.use(errorHandler);


// --------------------------------------------------
// Server
// --------------------------------------------------

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
