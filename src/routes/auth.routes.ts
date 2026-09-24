import { Router } from "express";

import {
  getMe,
  login,
  logout,
} from "../controllers/auth.controller.js";
import { requireJsonContentType } from "../middleware/requireJsonContentType.js";

const router = Router();

router.post("/auth/login", requireJsonContentType, login);
router.post("/auth/logout", logout);
router.get("/me", getMe);

export default router;
