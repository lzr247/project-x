import express from "express";
import { register, login } from "../controllers/auth.controller";
import { validateRegister, validateLogin } from "../middleware/validation.middleware";

const router = express.Router();

// POST /api/auth/register
router.post("/register", validateRegister, register);

// POST /api/auth/login
router.post("/login", validateLogin, login);

export default router;
