import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { apiRoutes } from "./routes/index.js";
import { authRoutes } from "./routes/auth.js";
import { notFound, errorHandler } from "./middleware/error.js";
import { upload } from "./middleware/upload.js";
import { authMiddleware } from "./middleware/auth.js";

dotenv.config();

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN || "*", methods: "GET, POST, PUT, DELETE, OPTIONS", allowedHeaders: "Content-Type, Authorization, X-Client-Info, Apikey" }));
  app.use(express.json({ limit: "12mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "Kushal Multi Speciality Hospital API", time: new Date().toISOString() }));

  app.use("/api/auth", authRoutes());
  app.use("/api", apiRoutes());

  app.post("/api/upload", authMiddleware, upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    res.json({ url: "/uploads/" + req.file.filename, filename: req.file.filename });
  });

  app.use("/uploads", express.static(path.resolve("server/uploads")));

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
