/**
 * Login page logic
 */
(function () {
  "use strict";

  document.getElementById("authLogo").innerHTML = Auth.logoSvg(48);
  document.title = "Kushal Multi Speciality Hospital";

  const errBox = document.getElementById("authError");
  const btn = document.getElementById("loginBtn");
  const btnText = document.getElementById("loginBtnText");

  function showError(msg) {
    errBox.textContent = msg;
    errBox.style.display = "block";
  }
  function clearError() { errBox.style.display = "none"; }

  document.getElementById("togglePw").addEventListener("click", function () {
    const pw = document.getElementById("password");
    const icon = this.querySelector("i");
    if (pw.type === "password") { pw.type = "text"; icon.className = "fa-solid fa-eye-slash"; }
    else { pw.type = "password"; icon.className = "fa-solid fa-eye"; }
  });

  document.getElementById("forgot").addEventListener("click", function (e) {
    e.preventDefault();
    Validation.toast("Password reset is not available in Demo Mode. Use admin@kmsh.in / admin123", "info");
  });

  async function doLogin(email, password) {
    clearError();
    btn.disabled = true;
    btnText.textContent = "Signing in…";
    try {
      const res = await API.login(email, password);
      Validation.toast("Welcome back, " + (res.user.name || "User") + "!", "success");
      setTimeout(() => { window.location.href = "dashboard.html"; }, 600);
    } catch (e) {
      showError(e.message || "Login failed");
      btn.disabled = false;
      btnText.textContent = "Sign In";
    }
  }

  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    if (!email || !password) { showError("Please enter email and password"); return; }
    if (!Validation.isEmail(email)) { showError("Please enter a valid email"); return; }
    doLogin(email, password);
  });

  document.getElementById("demoBtn").addEventListener("click", function () {
    document.getElementById("email").value = "admin@kmsh.in";
    document.getElementById("password").value = "admin123";
    doLogin("admin@kmsh.in", "admin123");
  });

  // Show mode badge
  API.checkBackend().then((online) => {
    const badge = document.getElementById("modeBadge");
    if (online) badge.textContent = "Connected to backend server";
    else badge.innerHTML = '<i class="fa-solid fa-circle"></i> Demo Mode active — data stored in your browser';
  });

  // If already logged in, skip
  if (API.currentUser()) {
    window.location.href = "dashboard.html";
  }
})();
