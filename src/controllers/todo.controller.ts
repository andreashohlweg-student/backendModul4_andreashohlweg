import type { Request, Response, NextFunction } from "express";
import type { Todo } from "../types/todo.js";
import type { CreateTodoBody } from "../types/todoRequest.js";

import {
  createTodo,
  getAllTodos,
} from "../services/todo.service.js";
import { TodoTitleMissingError } from "../errors/todoTitleMissingError.js";
import { TodoTitleTypeError } from "../errors/todoTitleTypeError.js";
import { TodoTitleEmptyError } from "../errors/todoTitleEmptyError.js";
import { TodoTitleTooLongError } from "../errors/todoTitleTooLongError.js";

export const getTodos = (
  _req: Request,
  res: Response<Todo[]>,
  next: NextFunction,
) => {
  try {
    const todos = getAllTodos();

    res.json(todos);
  } catch (error) {
    next(error);
  }
};

export const createTodoController = (
  req: Request<{}, {}, CreateTodoBody>,
  res: Response<Todo>,
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

    const newTodo = createTodo(title.trim());

    res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
};
