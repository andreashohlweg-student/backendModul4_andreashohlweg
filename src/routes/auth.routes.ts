import { Router } from "express";

import {
  getMe,
  login,
  logout,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/auth/login", login);
router.post("/auth/logout", logout);
router.get("/me", getMe);

export default router;
