import { Router } from "express";

import {
  createTodoController,
  getTodos,
} from "../controllers/todo.controller.js";

const router = Router();

router.get("/", getTodos);
router.post("/", createTodoController);

export default router;
