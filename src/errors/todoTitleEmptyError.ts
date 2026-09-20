import { AppError } from "./appError.js";

export class TodoTitleEmptyError extends AppError {
  constructor() {
    super(400, "'title' darf nicht leer sein.");
  }
}
