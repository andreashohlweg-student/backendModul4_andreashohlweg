import type { Todo } from "../types/todo.js";

const todos: Todo[] = [];

export const getAllTodos = (): Todo[] => {
  return todos;
};

export const createTodo = (title: string): Todo => {
  const newTodo: Todo = {
    id: todos.length + 1,
    title,
    done: false,
  };

  todos.push(newTodo);

  return newTodo;
};
