import type { Request, Response } from "express";
import type { Todo } from "../types/todo.js";

import {
  createTodo,
  getAllTodos,
} from "../services/todo.service.js";
import { TodoTitleMissingError } from "../errors/todoTitleMissingError.js";
import { TodoTitleTypeError } from "../errors/todoTitleTypeError.js";
import { TodoTitleEmptyError } from "../errors/todoTitleEmptyError.js";
import { TodoTitleTooLongError } from "../errors/todoTitleTooLongError.js";
import { isRecord } from "../utils/isRecord.js";

export const getTodos = (
  _req: Request,
  res: Response<Todo[]>,
) => {
  const todos = getAllTodos();

  res.json(todos);
};

export const createTodoController = (
  req: Request<{}, {}, unknown>,
  res: Response<Todo>,
) => {
  if (!isRecord(req.body)) {
    throw new TodoTitleMissingError();
  }

  const { title } = req.body;

  if (title === undefined) {
    throw new TodoTitleMissingError();
  }

  if (typeof title !== "string") {
    throw new TodoTitleTypeError();
  }

  if (title.trim().length === 0) {
    throw new TodoTitleEmptyError();
  }

  if (title.length > 100) {
    throw new TodoTitleTooLongError();
  }

  const newTodo = createTodo(title.trim());

  res.status(201).json(newTodo);
};
