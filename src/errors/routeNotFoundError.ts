import { AppError } from "./appError.js";

export class RouteNotFoundError extends AppError {
  constructor() {
    super(404, "Route not found");
  }
}
