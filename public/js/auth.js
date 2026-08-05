/**
 * Kushal Multi Speciality Hospital - Auth guard + shared layout
 * Renders the sidebar/navbar/footer shell and enforces login on protected pages.
 */
window.Auth = (function () {
  "use strict";

  const cfg = window.API_CONFIG;

  const MENU = [
    { href: "dashboard.html", icon: "fa-gauge-high", label: "Dashboard", roles: ["Administrator", "Doctor", "Receptionist", "Nurse", "Lab Technician", "Pharmacist", "Patient"] },
    { href: "patients.html", icon: "fa-user-injured", label: "Patients", roles: ["Administrator", "Doctor", "Receptionist", "Nurse"] },
    { href: "doctors.html", icon: "fa-user-doctor", label: "Doctors", roles: ["Administrator", "Doctor", "Receptionist", "Nurse", "Patient"] },
    { href: "appointments.html", icon: "fa-calendar-check", label: "Appointments", roles: ["Administrator", "Doctor", "Receptionist", "Nurse", "Patient"] },
    { href: "departments.html", icon: "fa-building-circle-check", label: "Departments", roles: ["Administrator"] },
    { href: "operations.html", icon: "fa-user-nurse", label: "Operations", roles: ["Administrator", "Doctor", "Nurse"] },
    { href: "laboratory.html", icon: "fa-flask-vial", label: "Laboratory", roles: ["Administrator", "Doctor", "Lab Technician"] },
    { href: "pharmacy.html", icon: "fa-prescription-bottle-medical", label: "Pharmacy", roles: ["Administrator", "Pharmacist", "Doctor"] },
    { href: "billing.html", icon: "fa-file-invoice-dollar", label: "Billing", roles: ["Administrator", "Receptionist"] },
    { href: "staff.html", icon: "fa-users-gear", label: "Staff", roles: ["Administrator"] },
    { href: "reports.html", icon: "fa-chart-line", label: "Reports", roles: ["Administrator"] },
    { href: "notifications.html", icon: "fa-bell", label: "Notifications", roles: ["Administrator", "Doctor", "Receptionist", "Nurse", "Lab Technician", "Pharmacist", "Patient"] },
    { href: "profile.html", icon: "fa-user", label: "Profile", roles: ["Administrator", "Doctor", "Receptionist", "Nurse", "Lab Technician", "Pharmacist", "Patient"] },
    { href: "settings.html", icon: "fa-gear", label: "Settings", roles: ["Administrator", "Doctor", "Receptionist", "Nurse", "Lab Technician", "Pharmacist", "Patient"] },
  ];

  function requireAuth() {
    const user = API.currentUser();
    if (!user) {
      window.location.href = "login.html";
      return null;
    }
    return user;
  }

  function logout() {
    API.logout();
    window.location.href = "login.html";
  }

  function toggleTheme() {
    const cur = localStorage.getItem(cfg.THEME_KEY) || "light";
    const next = cur === "light" ? "dark" : "light";
    localStorage.setItem(cfg.THEME_KEY, next);
    applyTheme(next);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme || "light");
    const btn = document.getElementById("themeToggle");
    if (btn) {
      btn.innerHTML =
        theme === "dark"
          ? '<i class="fa-solid fa-sun"></i>'
          : '<i class="fa-solid fa-moon"></i>';
    }
  }

  function logoSvg(size) {
    size = size || 40;
    return (
      '<span class="logo-mark" style="width:' + size + 'px;height:' + size + 'px">' +
      '<svg viewBox="0 0 64 64" width="' + size + '" height="' + size + '" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#2563eb"/><stop offset="1" stop-color="#059669"/>' +
      '</linearGradient></defs>' +
      '<rect x="2" y="2" width="60" height="60" rx="16" fill="url(#lg)"/>' +
      '<path d="M26 14h12v12h12v12H38v12H26V38H14V26h12z" fill="#fff"/>' +
      '<path d="M32 30c-4-6-10-4-10 2 0 5 10 12 10 12s10-7 10-12c0-6-6-8-10-2z" fill="#fde68a" opacity="0.95"/>' +
      '</svg></span>'
    );
  }

  function renderShell(user, activePage) {
    const role = user.role || "Administrator";
    const menuHtml = MENU.filter((m) => m.roles.includes(role))
      .map(
        (m) =>
          '<a href="' +
          m.href +
          '" class="nav-item' +
          (m.href === activePage ? " active" : "") +
          '"><i class="fa-solid ' +
          m.icon +
          '"></i><span>' +
          m.label +
          "</span></a>"
      )
      .join("");

    const demoBanner = API.isDemoMode()
      ? '<div class="demo-banner"><i class="fa-solid fa-circle-info"></i> ' +
        Utils.escapeHtml(cfg.DEMO_MODE_NOTICE) +
        "</div>"
      : "";

    document.body.classList.add("app-shell");
    document.body.insertAdjacentHTML(
      "afterbegin",
      '<aside class="sidebar" id="sidebar">' +
        '<div class="sidebar-brand">' +
        logoSvg(40) +
        '<div class="brand-text"><div class="brand-name">KUSHAL</div><div class="brand-sub">Multi Speciality Hospital</div></div>' +
        '<button class="sidebar-close" id="sidebarClose" aria-label="Close menu"><i class="fa-solid fa-xmark"></i></button>' +
        "</div>" +
        '<nav class="sidebar-nav">' + menuHtml + "</nav>" +
        '<div class="sidebar-foot">' +
        '<button class="nav-item" id="logoutBtn"><i class="fa-solid fa-right-from-bracket"></i><span>Logout</span></button>' +
        "</div>" +
        "</aside>" +
        '<div class="sidebar-overlay" id="sidebarOverlay"></div>' +
        '<div class="main">' +
        '<header class="topbar">' +
        '<button class="icon-btn" id="menuToggle" aria-label="Open menu"><i class="fa-solid fa-bars"></i></button>' +
        '<div class="topbar-search">' +
        '<i class="fa-solid fa-magnifying-glass"></i>' +
        '<input id="globalSearch" type="text" placeholder="Search patients, doctors, appointments…" />' +
        '<div id="globalSearchResults" class="global-search-results"></div>' +
        "</div>" +
        '<div class="topbar-actions">' +
        '<button class="icon-btn" id="themeToggle" aria-label="Toggle theme"><i class="fa-solid fa-moon"></i></button>' +
        '<a class="icon-btn" href="notifications.html" aria-label="Notifications"><i class="fa-solid fa-bell"></i><span class="dot" id="notifDot"></span></a>' +
        '<a class="topbar-user" href="profile.html">' +
        Utils.avatarHtml(user.name, null, 34) +
        "<div><div>" + Utils.escapeHtml(user.name) + "</div><small>" + Utils.escapeHtml(role) + "</small></div>" +
        "</a>" +
        "</div>" +
        "</header>" +
        '<main class="content" id="pageContent">' + demoBanner + "</main>" +
        '<footer class="footer"><span>© ' + new Date().getFullYear() + ' Kushal Multi Speciality Hospital</span><span>v1.0</span></footer>' +
        "</div>"
    );

    applyTheme(localStorage.getItem(cfg.THEME_KEY) || "light");

    document.getElementById("menuToggle").addEventListener("click", () => {
      document.getElementById("sidebar").classList.add("open");
      document.getElementById("sidebarOverlay").classList.add("show");
    });
    document.getElementById("sidebarClose").addEventListener("click", closeSidebar);
    document.getElementById("sidebarOverlay").addEventListener("click", closeSidebar);
    document.getElementById("logoutBtn").addEventListener("click", logout);
    document.getElementById("themeToggle").addEventListener("click", toggleTheme);

    setupGlobalSearch();
    refreshNotifDot();
  }

  function closeSidebar() {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("sidebarOverlay").classList.remove("show");
  }

  async function refreshNotifDot() {
    try {
      const notes = await API.list("notifications");
      const unread = (notes || []).filter((n) => !n.read).length;
      const dot = document.getElementById("notifDot");
      if (dot) dot.style.display = unread ? "flex" : "none";
    } catch (e) {}
  }

  function setupGlobalSearch() {
    const input = document.getElementById("globalSearch");
    const box = document.getElementById("globalSearchResults");
    if (!input) return;
    const run = Utils.debounce(async () => {
      const q = input.value.trim().toLowerCase();
      if (!q) { box.innerHTML = ""; box.style.display = "none"; return; }
      const [patients, doctors, appts] = await Promise.all([
        API.list("patients"), API.list("doctors"), API.list("appointments"),
      ]);
      const p = (patients || []).filter((x) => (x.firstName + " " + x.lastName + " " + x.id).toLowerCase().includes(q)).slice(0, 4)
        .map((x) => '<a href="patient-details.html?id=' + encodeURIComponent(x.id) + '"><i class="fa-solid fa-user-injured"></i> ' + Utils.escapeHtml(x.firstName + " " + x.lastName) + " <small>" + Utils.escapeHtml(x.id) + "</small></a>");
      const d = (doctors || []).filter((x) => (x.name + " " + x.id + " " + x.spec).toLowerCase().includes(q)).slice(0, 4)
        .map((x) => '<a href="doctor-details.html?id=' + encodeURIComponent(x.id) + '"><i class="fa-solid fa-user-doctor"></i> ' + Utils.escapeHtml(x.name) + " <small>" + Utils.escapeHtml(x.spec) + "</small></a>");
      const a = (appts || []).filter((x) => (x.patient + " " + x.doctor + " " + x.id).toLowerCase().includes(q)).slice(0, 3)
        .map((x) => '<a href="appointments.html"><i class="fa-solid fa-calendar-check"></i> ' + Utils.escapeHtml(x.patient) + " → " + Utils.escapeHtml(x.doctor) + "</a>");
      const all = p.concat(d, a);
      box.innerHTML = all.length ? all.join("") : '<div class="empty">No matches</div>';
      box.style.display = "block";
    }, 250);
    input.addEventListener("input", run);
    input.addEventListener("blur", () => setTimeout(() => { box.style.display = "none"; }, 200));
    input.addEventListener("focus", run);
  }

  return {
    requireAuth, logout, toggleTheme, applyTheme,
    renderShell, logoSvg, MENU, refreshNotifDot,
  };
})();
