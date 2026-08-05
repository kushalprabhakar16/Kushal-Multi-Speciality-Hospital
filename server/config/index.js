export const jwtConfig = {
  secret: process.env.JWT_SECRET || "dev_secret_change_me",
  expiresIn: process.env.JWT_EXPIRES_IN || "7d",
};

export const corsConfig = {
  origin: process.env.CORS_ORIGIN || "*",
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization, X-Client-Info, Apikey",
};
