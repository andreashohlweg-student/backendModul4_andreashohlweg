export type Todo = {
  id: number;
  title: string;
  done: boolean;
};

export type CreateTodoBody = {
  title: string;
};