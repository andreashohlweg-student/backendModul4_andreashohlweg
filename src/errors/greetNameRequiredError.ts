import { AppError } from "./appError.js";

export class GreetNameRequiredError extends AppError {
  constructor() {
    super(400, "Name is required");
  }
}
