import { Router } from "express";

import {
  createTodoController,
  getTodos,
} from "../controllers/todo.controller.js";
import { requireJsonContentType } from "../middleware/requireJsonContentType.js";

const router = Router();

router.get("/", getTodos);
router.post("/", requireJsonContentType, createTodoController);

export default router;
