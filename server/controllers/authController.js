import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/index.js";
import { jwtConfig } from "../config/index.js";

export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
    const existing = await UserModel.findByEmail(email);
    if (existing) return res.status(409).json({ message: "Email already registered" });
    const hash = await bcrypt.hash(password, 10);
    await UserModel.create({ name, email, password: hash, role: role || "Patient", status: "Active" });
    const user = await UserModel.findByEmail(email);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { next(e); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
    const user = await UserModel.findByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid email or password" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid email or password" });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { next(e); }
}

export async function me(req, res) {
  res.json({ user: req.user });
}
