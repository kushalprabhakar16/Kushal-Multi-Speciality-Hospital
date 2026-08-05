export function errorHandler(err, _req, res, _next) {
  console.error("[error]", err.message);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
}

export function notFound(_req, res) {
  res.status(404).json({ message: "Route not found" });
}
