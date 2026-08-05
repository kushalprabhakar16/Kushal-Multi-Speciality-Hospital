/**
 * Kushal Multi Speciality Hospital - API client
 * Talks to the Express backend when available, and transparently falls back to
 * the LocalStorage data layer (Demo Mode) when the backend is unreachable.
 */
window.API = (function () {
  "use strict";

  const cfg = window.API_CONFIG;

  async function request(path, options) {
    options = options || {};
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), cfg.TIMEOUT);
    const token = localStorage.getItem(cfg.TOKEN_KEY);
    const headers = Object.assign(
      { "Content-Type": "application/json" },
      options.headers || {}
    );
    if (token) headers["Authorization"] = "Bearer " + token;

    try {
      const res = await fetch(cfg.API_BASE_URL + path, {
        method: options.method || "GET",
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!res.ok) {
        const msg = await safeError(res);
        throw new Error(msg || ("HTTP " + res.status));
      }
      const isJson = (res.headers.get("content-type") || "").includes("application/json");
      return isJson ? await res.json() : await res.text();
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  }

  async function safeError(res) {
    try {
      const j = await res.json();
      return j.message || j.error || "";
    } catch (e) {
      return "";
    }
  }

  // Probe backend once per session; cache the result.
  let backendOnline = null;
  async function checkBackend() {
    if (backendOnline !== null) return backendOnline;
    try {
      await request("/health", { method: "GET" });
      backendOnline = true;
      Storage.setDemoMode(false);
    } catch (e) {
      backendOnline = false;
      Storage.setDemoMode(true);
      Storage.seedIfEmpty();
    }
    return backendOnline;
  }

  async function ensureReady() {
    await checkBackend();
    return backendOnline;
  }

  async function list(resource, query) {
    if (await ensureReady()) {
      const qs = query ? "?" + new URLSearchParams(query).toString() : "";
      return await request("/" + resource + qs);
    }
    return Storage.getAll(mapTable(resource));
  }

  async function getOne(resource, id) {
    if (await ensureReady()) {
      return await request("/" + resource + "/" + encodeURIComponent(id));
    }
    return Storage.getById(mapTable(resource), id);
  }

  async function create(resource, body) {
    if (await ensureReady()) {
      return await request("/" + resource, { method: "POST", body });
    }
    return Storage.insert(mapTable(resource), body);
  }

  async function updateOne(resource, id, body) {
    if (await ensureReady()) {
      return await request("/" + resource + "/" + encodeURIComponent(id), { method: "PUT", body });
    }
    return Storage.update(mapTable(resource), id, body);
  }

  async function removeOne(resource, id) {
    if (await ensureReady()) {
      return await request("/" + resource + "/" + encodeURIComponent(id), { method: "DELETE" });
    }
    Storage.remove(mapTable(resource), id);
    return { success: true };
  }

  function mapTable(resource) {
    const map = {
      patients: "patients",
      doctors: "doctors",
      appointments: "appointments",
      departments: "departments",
      operations: "operations",
      "lab-tests": "labTests",
      pharmacy: "medicines",
      billing: "bills",
      staff: "staff",
      users: "users",
      notifications: "notifications",
    };
    return map[resource] || resource;
  }

  async function login(email, password) {
    if (await ensureReady()) {
      const res = await request("/auth/login", { method: "POST", body: { email, password } });
      if (res && res.token) {
        localStorage.setItem(cfg.TOKEN_KEY, res.token);
        localStorage.setItem(cfg.USER_KEY, JSON.stringify(res.user || {}));
      }
      return res;
    }
    // Demo login
    const users = Storage.getAll("users");
    let user = users.find(
      (u) => u.email.toLowerCase() === String(email).toLowerCase() && u.password === password
    );
    if (!user && email === "admin@kmsh.in" && password === "admin123") {
      user = users[0];
    }
    if (!user) throw new Error("Invalid email or password");
    const fakeToken = "demo." + btoa(user.email) + ".token";
    localStorage.setItem(cfg.TOKEN_KEY, fakeToken);
    localStorage.setItem(cfg.USER_KEY, JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role }));
    return { token: fakeToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  async function register(body) {
    if (await ensureReady()) {
      const res = await request("/auth/register", { method: "POST", body });
      if (res && res.token) {
        localStorage.setItem(cfg.TOKEN_KEY, res.token);
        localStorage.setItem(cfg.USER_KEY, JSON.stringify(res.user || {}));
      }
      return res;
    }
    const users = Storage.getAll("users");
    if (users.find((u) => u.email.toLowerCase() === String(body.email).toLowerCase())) {
      throw new Error("Email already registered");
    }
    const user = {
      id: users.length + 1,
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role || "Patient",
      status: "Active",
      createdAt: new Date().toISOString(),
    };
    Storage.insert("users", user);
    const token = "demo." + btoa(user.email) + ".token";
    localStorage.setItem(cfg.TOKEN_KEY, token);
    localStorage.setItem(cfg.USER_KEY, JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role }));
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  function logout() {
    localStorage.removeItem(cfg.TOKEN_KEY);
    localStorage.removeItem(cfg.USER_KEY);
  }

  function currentUser() {
    try {
      return JSON.parse(localStorage.getItem(cfg.USER_KEY) || "null");
    } catch (e) {
      return null;
    }
  }

  return {
    list, getOne, create, updateOne, removeOne,
    login, register, logout, currentUser,
    checkBackend, isDemoMode: () => Storage.isDemoMode(),
  };
})();
