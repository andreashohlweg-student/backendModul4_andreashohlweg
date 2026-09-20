import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import tweetRouter from "./routes/tweet.routes.js";
import userRouter from "./routes/user.routes.js";
import todoRouter from "./routes/todo.routes.js";
import authRouter from "./routes/auth.routes.js";
import generalRouter from "./routes/general.routes.js";

import { errorHandler } from "./middleware/errorHandler.js";

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
app.use(generalRouter);


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
