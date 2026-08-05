/**
 * Dashboard page
 */
(function () {
  "use strict";

  const user = Auth.requireAuth();
  if (!user) return;
  Auth.renderShell(user, "dashboard.html");

  const content = document.getElementById("pageContent");
  const demo = API.isDemoMode();
  const demoBanner = demo ? document.querySelector(".demo-banner") : null;

  content.insertAdjacentHTML(
    "beforeend",
    '<div class="page-head fade-in-up">' +
      '<div class="left"><div class="icon-pill"><i class="fa-solid fa-gauge-high"></i></div>' +
      '<div><div class="page-title">Dashboard</div><div class="page-sub">Welcome back, ' + Utils.escapeHtml(user.name) + " — here's what's happening today.</div></div></div>" +
      '<div class="actions"><button class="btn btn-ghost" id="refreshBtn"><i class="fa-solid fa-rotate"></i> Refresh</button>' +
      '<a href="add-patient.html" class="btn"><i class="fa-solid fa-plus"></i> Add Patient</a></div>' +
    "</div>" +
    '<div class="stat-grid stagger" id="statGrid"></div>' +
    '<div class="grid-2" style="margin-bottom:18px">' +
      '<div class="chart-card fade-in-up"><h3 class="section-title">Patient Admissions — Last 7 Days</h3><div class="bar-chart" id="barChart"></div></div>' +
      '<div class="chart-card fade-in-up"><h3 class="section-title">Bed Occupancy</h3><div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap;justify-content:center">' +
        '<div class="donut" id="donut"></div>' +
        '<div id="donutLegend" style="display:flex;flex-direction:column;gap:8px"></div>' +
      "</div></div>" +
    "</div>" +
    '<div class="grid-2">' +
      '<div class="chart-card fade-in-up"><h3 class="section-title">Today\'s Appointments</h3><div id="apptList"></div></div>' +
      '<div class="chart-card fade-in-up"><h3 class="section-title">Recent Patients</h3><div id="recentPatients"></div></div>' +
    "</div>"
  );

  document.getElementById("refreshBtn").addEventListener("click", () => { renderAll(); Validation.toast("Dashboard refreshed", "info"); });

  function animateCount(el, target) {
    const dur = 900;
    const start = performance.now();
    function step(t) {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target).toLocaleString("en-IN");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function statCard(icon, label, value, foot, cls) {
    return '<div class="stat-card ' + cls + '"><i class="fa-solid ' + icon + ' stat-icon"></i>' +
      '<div class="stat-label">' + label + '</div><div class="stat-value" data-count="' + value + '">0</div>' +
      '<div class="stat-foot">' + foot + '</div></div>';
  }

  async function renderAll() {
    const [patients, doctors, appts, depts, meds, bills, ops, staff] = await Promise.all([
      API.list("patients"), API.list("doctors"), API.list("appointments"),
      API.list("departments"), API.list("pharmacy"), API.list("billing"),
      API.list("operations"), API.list("staff"),
    ]);

    const admitted = patients.filter((p) => p.status === "Admitted").length;
    const emergency = patients.filter((p) => p.status === "Emergency").length;
    const todayAppts = appts.filter((a) => (a.date || "").slice(0, 10) === Utils.todayISO());
    const pendingAppts = todayAppts.filter((a) => a.status === "Pending").length;
    const todaySurgeries = ops.filter((o) => (o.date || "").slice(0, 10) === Utils.todayISO()).length;
    const lowStock = meds.filter((m) => Number(m.qty) <= 50 && Number(m.qty) > 0).length;
    const expired = meds.filter((m) => m.expiry && new Date(m.expiry) < new Date()).length;
    const todayRevenue = bills.filter((b) => (b.date || "").slice(0, 10) === Utils.todayISO()).reduce((s, b) => s + Number(b.paid || 0), 0);
    const nurses = staff.filter((s) => s.role === "Nurse").length;
    const totalBeds = 250;
    const occupied = Math.min(admitted, totalBeds);
    const icuBeds = 40; const icuUsed = Math.min(Math.ceil(admitted * 0.25), icuBeds);

    const grid = document.getElementById("statGrid");
    grid.innerHTML =
      statCard("fa-user-injured", "Total Patients", patients.length, admitted + " admitted", "stat-blue") +
      statCard("fa-user-doctor", "Doctors", doctors.length, depts.length + " departments", "stat-emerald") +
      statCard("fa-user-nurse", "Nurses", nurses, "Available now", "stat-purple") +
      statCard("fa-users-gear", "Staff", staff.length, "All roles", "stat-teal") +
      statCard("fa-calendar-check", "Today's Appointments", todayAppts.length, pendingAppts + " pending", "stat-orange") +
      statCard("fa-user-nurse", "Surgeries Today", todaySurgeries, "Scheduled", "stat-pink") +
      statCard("fa-bed-pulse", "Available Beds", totalBeds - occupied, occupied + "/" + totalBeds + " occupied", "stat-gold") +
      statCard("fa-triangle-exclamation", "Emergency Cases", emergency, "Needs attention", "stat-red") +
      statCard("fa-flask-vial", "Lab Tests", "—", "Pending review", "stat-blue") +
      statCard("fa-prescription-bottle-medical", "Pharmacy Stock", meds.length, lowStock + " low, " + expired + " expired", "stat-emerald") +
      statCard("fa-file-invoice-dollar", "Today's Revenue", todayRevenue, "Collected today", "stat-gold") +
      statCard("fa-building-circle-check", "Departments", depts.length, "Multi-speciality", "stat-purple");

    grid.querySelectorAll(".stat-value[data-count]").forEach((el) => {
      const v = parseInt(el.getAttribute("data-count"), 10) || 0;
      animateCount(el, v);
    });

    // Bar chart - last 7 days admissions
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const count = patients.filter((p) => (p.admissionDate || "").slice(0, 10) === iso).length;
      days.push({ label: d.toLocaleDateString("en-IN", { weekday: "short" }), count });
    }
    const maxBar = Math.max(1, ...days.map((d) => d.count));
    const bar = document.getElementById("barChart");
    bar.innerHTML = days.map((d) =>
      '<div class="bar" style="height:' + Math.max(6, (d.count / maxBar) * 100) + '%"><span>' + d.count + '</span><small>' + d.label + '</small></div>'
    ).join("");

    // Donut - bed occupancy
    const donut = document.getElementById("donut");
    const pct = Math.round((occupied / totalBeds) * 100);
    donut.style.background = "conic-gradient(var(--primary) 0 " + pct + "%, var(--surface-3) " + pct + "% 100%)";
    donut.innerHTML = '<div class="hole"><b>' + pct + '%</b><small>Occupied</small></div>';
    document.getElementById("donutLegend").innerHTML =
      legendDot("var(--primary)", "Occupied", occupied) +
      legendDot("var(--surface-3)", "Available", totalBeds - occupied) +
      legendDot("var(--danger)", "ICU Used", icuUsed) +
      legendDot("var(--success)", "ICU Free", icuBeds - icuUsed);

    // Today's appointments
    const apptList = document.getElementById("apptList");
    if (!todayAppts.length) {
      apptList.innerHTML = '<div class="empty-state"><i class="fa-solid fa-calendar"></i>No appointments scheduled for today.</div>';
    } else {
      apptList.innerHTML = todayAppts.slice(0, 6).map((a) =>
        '<div class="list-row">' + Utils.avatarHtml(a.patient, null, 36) +
        '<div class="lr-meta"><b>' + Utils.escapeHtml(a.patient) + '</b><small>' + Utils.escapeHtml(a.doctor) + " • " + Utils.escapeHtml(a.reason || "") + '</small></div>' +
        '<div style="text-align:right"><div style="font-weight:700">' + Utils.escapeHtml(a.time || "") + '</div>' + Utils.statusBadge(a.status) + '</div></div>'
      ).join("");
    }

    // Recent patients
    const recent = document.getElementById("recentPatients");
    if (!patients.length) {
      recent.innerHTML = '<div class="empty-state"><i class="fa-solid fa-user-injured"></i>No patients yet.</div>';
    } else {
      recent.innerHTML = patients.slice(0, 6).map((p) =>
        '<div class="list-row">' + Utils.avatarHtml(p.firstName + " " + p.lastName, p.photo, 36) +
        '<div class="lr-meta"><b>' + Utils.escapeHtml(p.firstName + " " + p.lastName) + '</b><small>' + Utils.escapeHtml(p.id) + " • " + Utils.escapeHtml(p.department || "") + '</small></div>' +
        '<div style="text-align:right">' + Utils.statusBadge(p.status) + '<div><small>' + Utils.escapeHtml(Utils.fmtDate(p.admissionDate)) + '</small></div></div></div>'
      ).join("");
    }
  }

  function legendDot(color, label, val) {
    return '<div style="display:flex;align-items:center;gap:8px;font-size:0.84rem"><span style="width:12px;height:12px;border-radius:4px;background:' + color + '"></span>' + Utils.escapeHtml(label) + ' <b>' + val + '</b></div>';
  }

  renderAll().catch((e) => Validation.toast("Could not load dashboard: " + e.message, "error"));
})();
