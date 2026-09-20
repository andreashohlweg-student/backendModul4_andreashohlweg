import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";


import tweetRouter from "./routes/tweet.routes.js";
import userRouter from "./routes/user.routes.js";

import usersData from "../data/users.json" with { type: "json" };

import { errorHandler } from "./middleware/errorHandler.js";

import type { Request, Response } from "express";

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

import type { User } from "./types/user.js";

import { createSession, getUsernameBySession, deleteSession } from "./services/session.service.js";

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

const users: User[] = usersData;

const registeredUsers = new Map<string, string>([
  ["alice", process.env.ALICE_PASSWORD ?? ""],
  ["bob", process.env.BOB_PASSWORD ?? ""],
  ["charlie", process.env.CHARLIE_PASSWORD ?? ""],
]);

const todos: Todo[] = [];

// --------------------------------------------------
// Auth
// --------------------------------------------------

app.post(
  "/auth/login",
  (
    req: Request<{}, {}, LoginRequestBody>,
    res: Response<LoginResponse | AuthErrorResponse>,
  ) => {
    const { username, password } = req.body;

    const storedPassword = registeredUsers.get(username);

    if (!storedPassword || storedPassword !== password) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const sessionId = createSession(username);

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
    });

    res.json({
      message: "Login succeeded",
    });
  },
);


app.post(
  "/auth/logout",
  (req: Request, res: Response<LogoutResponse>) => {
    const sessionId = req.cookies.sessionId;

    if (typeof sessionId === "string") {
      deleteSession(sessionId);
    }

    res.clearCookie("sessionId");

    res.json({
      success: true,
      message: "Logged out",
    });
  },
);


app.get(
  "/me",
  (
    req: Request,
    res: Response<MeResponse | AuthErrorResponse>,
  ) => {
    const sessionId = req.cookies.sessionId;

    if (typeof sessionId !== "string") {
      return res.status(401).json({
        error: "Not signed in",
      });
    }

    const username = getUsernameBySession(sessionId);

    if (!username) {
      return res.status(401).json({
        error: "Not signed in",
      });
    }

    res.json({
      user: username,
    });
  },
);


// --------------------------------------------------
// Users
// --------------------------------------------------

app.get(
  "/users",
  (_req: Request, res: Response<User[]>) => {
    res.status(200).json(users);
  },
);


// --------------------------------------------------
// Todos
// --------------------------------------------------

app.get(
  "/todos",
  (_req: Request, res: Response<Todo[]>) => {
    res.json(todos);
  },
);


app.post(
  "/todos",
  (
    req: Request<{}, {}, CreateTodoBody>,
    res: Response<Todo | ErrorResponse>,
  ) => {
    const { title } = req.body;

    if (title === undefined) {
      return res.status(400).json({
        error: "Das Feld 'title' fehlt.",
      });
    }

    if (typeof title !== "string") {
      return res.status(400).json({
        error: "'title' muss ein String sein.",
      });
    }

    if (title.trim().length === 0) {
      return res.status(400).json({
        error: "'title' darf nicht leer sein.",
      });
    }

    if (title.length > 100) {
      return res.status(400).json({
        error: "'title' darf maximal 100 Zeichen lang sein.",
      });
    }

    const newTodo: Todo = {
      id: todos.length + 1,
      title: title.trim(),
      done: false,
    };

    todos.push(newTodo);

    res.status(201).json(newTodo);
  },
);


// --------------------------------------------------
// Tweets
// --------------------------------------------------

app.use("/tweets", tweetRouter);
app.use("/users", userRouter);

// --------------------------------------------------
// Allgemeine Routes
// --------------------------------------------------

app.get("/echo", (_req, res) => {
  res.send("Echo");
});


app.get(
  "/hello",
  (_req: Request, res: Response<HealthResponse>) => {
    res.status(200).json({
      success: true,
      message: "Syntax!",
      timestamp: new Date().toISOString(),
    });
  },
);


app.get(
  "/health",
  (_req: Request, res: Response<HealthResponse>) => {
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
  (req: Request, res: Response<GreetResponse>) => {
    const name = req.query.name;
    const lang = req.query.lang;

    const message =
      lang === "en"
        ? `Hello ${name}`
        : `Hallo ${name}`;

    res.json({ message });
  },
);

app.use(errorHandler)
// --------------------------------------------------
// Server
// --------------------------------------------------

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});