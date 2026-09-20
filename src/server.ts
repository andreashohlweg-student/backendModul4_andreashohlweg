import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import type { Request, Response, NextFunction } from "express";

import tweetRouter from "./routes/tweet.routes.js";
import userRouter from "./routes/user.routes.js";

import { getAllUsers } from "./services/user.service.js";
import {
  createSession,
  getUsernameBySession,
  deleteSession,
} from "./services/session.service.js";

import { errorHandler } from "./middleware/errorHandler.js";
import { InvalidCredentialsError } from "./errors/invalidCredentialsError.js";
import { NotSignedInError } from "./errors/notSignedInError.js";
import { TodoTitleMissingError } from "./errors/todoTitleMissingError.js";
import { TodoTitleTypeError } from "./errors/todoTitleTypeError.js";
import { TodoTitleEmptyError } from "./errors/todoTitleEmptyError.js";
import { TodoTitleTooLongError } from "./errors/todoTitleTooLongError.js";

import type {
  LoginRequestBody,
  LoginResponse,
  LogoutResponse,
  MeResponse,
  AuthErrorResponse,
} from "./types/auth.js";

import type {
  HealthResponse,
  GreetResponse,
  ErrorResponse,
} from "./types/common.js";

import type {
  Todo,
  CreateTodoBody,
} from "./types/todo.js";


// --------------------------------------------------
// App Setup
// --------------------------------------------------

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());


// --------------------------------------------------
// Daten
// --------------------------------------------------

const registeredUsers = new Map<string, string>(
  getAllUsers().map((user) => [
    user.username,
    process.env[`${user.username.toUpperCase()}_PASSWORD`] ?? "",
  ]),
);

const todos: Todo[] = [];


// --------------------------------------------------
// Auth
// --------------------------------------------------

app.post(
  "/auth/login",
  (
    req: Request<{}, {}, LoginRequestBody>,
    res: Response<LoginResponse | AuthErrorResponse>,
    next: NextFunction,
  ) => {
    try {
      const { username, password } = req.body;

      const storedPassword = registeredUsers.get(username);

      if (!storedPassword || storedPassword !== password) {
        return next(new InvalidCredentialsError());
      }

      const sessionId = createSession(username);

      res.cookie("sessionId", sessionId, {
        httpOnly: true,
      });

      res.json({
        message: "Login succeeded",
      });
    } catch (error) {
      next(error);
    }
  },
);

app.post(
  "/auth/logout",
  (
    req: Request,
    res: Response<LogoutResponse>,
    next: NextFunction,
  ) => {
    try {
      const sessionId = req.cookies.sessionId;

      if (typeof sessionId === "string") {
        deleteSession(sessionId);
      }

      res.clearCookie("sessionId");

      res.json({
        success: true,
        message: "Logged out",
      });
    } catch (error) {
      next(error);
    }
  },
);


app.get(
  "/me",
  (
    req: Request,
    res: Response<MeResponse | AuthErrorResponse>,
    next: NextFunction,
  ) => {
    try {
      const sessionId = req.cookies.sessionId;

      if (typeof sessionId !== "string") {
        return next(new NotSignedInError());
      }

      const username = getUsernameBySession(sessionId);

      if (!username) {
        return next(new NotSignedInError());
      }

      res.json({
        user: username,
      });
    } catch (error) {
      next(error);
    }
  },
);


// --------------------------------------------------
// Todos
// --------------------------------------------------

app.get(
  "/todos",
  (
    _req: Request,
    res: Response<Todo[]>,
  ) => {
    res.json(todos);
  },
);


app.post(
  "/todos",
  (
    req: Request<{}, {}, CreateTodoBody>,
    res: Response<Todo | ErrorResponse>,
    next: NextFunction,
  ) => {
    try {
      const { title } = req.body;

      if (title === undefined) {
        return next(new TodoTitleMissingError());
      }

      if (typeof title !== "string") {
        return next(new TodoTitleTypeError());
      }

      if (title.trim().length === 0) {
        return next(new TodoTitleEmptyError());
      }

      if (title.length > 100) {
        return next(new TodoTitleTooLongError());
      }

      const newTodo: Todo = {
        id: todos.length + 1,
        title: title.trim(),
        done: false,
      };

      todos.push(newTodo);

      res.status(201).json(newTodo);
    } catch (error) {
      next(error);
    }
  },
);


// --------------------------------------------------
// Resource Routes
// --------------------------------------------------

app.use("/tweets", tweetRouter);
app.use("/users", userRouter);


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
