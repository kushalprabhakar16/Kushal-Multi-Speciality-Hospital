import { Router } from "express";
import { register, login, me } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";

export function authRoutes() {
  const r = Router();
  r.post("/register", register);
  r.post("/login", login);
  r.get("/me", authMiddleware, me);
  return r;
}
