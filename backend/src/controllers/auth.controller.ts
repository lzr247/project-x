import { Request, Response } from "express";
import { prisma } from "../config/database";
import { comparePassword, hashPassword } from "../utils/password.utils";
import { generateToken } from "../utils/jwt.utils";

// POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Registration failed. Please try again." });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    // Remove password from user
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    return res.status(500).json({ message: "Server error." });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Compare password
    const isCorrectPassword = await comparePassword(password, user.password);

    if (!isCorrectPassword) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({ user: userWithoutPassword, token });
  } catch (error) {
    return res.status(500).json({ message: "Server error." });
  }
};
