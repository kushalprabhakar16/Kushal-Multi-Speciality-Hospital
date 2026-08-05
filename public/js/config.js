/**
 * Kushal Multi Speciality Hospital - API Configuration
 * Change API_BASE_URL to point to your backend server.
 * When the backend is unreachable, the app automatically falls back to Demo Mode (LocalStorage).
 */
window.API_CONFIG = {
  API_BASE_URL: "http://localhost:5000/api",
  DEMO_MODE_NOTICE: "Demo Mode — data is stored in your browser (LocalStorage).",
  TOKEN_KEY: "kmsh_token",
  USER_KEY: "kmsh_user",
  THEME_KEY: "kmsh_theme",
  DEMO_FLAG_KEY: "kmsh_demo_mode",
  // Request timeout in milliseconds
  TIMEOUT: 8000,
};
