/**
 * Kushal Multi Speciality Hospital - Utility helpers
 */
window.Utils = (function () {
  "use strict";

  function uid(prefix) {
    return (
      prefix +
      "-" +
      Date.now().toString(36).slice(-4).toUpperCase() +
      Math.random().toString(36).slice(2, 6).toUpperCase()
    );
  }

  function pad(n, len) {
    len = len || 6;
    return String(n).padStart(len, "0");
  }

  function nextPatientId() {
    const n = parseInt(localStorage.getItem("kmsh_patient_seq") || "0", 10) + 1;
    localStorage.setItem("kmsh_patient_seq", String(n));
    return "KMSH-P-" + pad(n);
  }

  function nextDoctorId() {
    const n = parseInt(localStorage.getItem("kmsh_doctor_seq") || "0", 10) + 1;
    localStorage.setItem("kmsh_doctor_seq", String(n));
    return "KMSH-D-" + pad(n);
  }

  function nextAppointmentId() {
    const n = parseInt(localStorage.getItem("kmsh_appt_seq") || "0", 10) + 1;
    localStorage.setItem("kmsh_appt_seq", String(n));
    return "KMSH-A-" + pad(n);
  }

  function nextOpId() {
    const n = parseInt(localStorage.getItem("kmsh_op_seq") || "0", 10) + 1;
    localStorage.setItem("kmsh_op_seq", String(n));
    return "KMSH-S-" + pad(n);
  }

  function nextLabId() {
    const n = parseInt(localStorage.getItem("kmsh_lab_seq") || "0", 10) + 1;
    localStorage.setItem("kmsh_lab_seq", String(n));
    return "KMSH-L-" + pad(n);
  }

  function nextMedId() {
    const n = parseInt(localStorage.getItem("kmsh_med_seq") || "0", 10) + 1;
    localStorage.setItem("kmsh_med_seq", String(n));
    return "KMSH-M-" + pad(n);
  }

  function nextBillId() {
    const n = parseInt(localStorage.getItem("kmsh_bill_seq") || "0", 10) + 1;
    localStorage.setItem("kmsh_bill_seq", String(n));
    return "KMSH-B-" + pad(n);
  }

  function nextStaffId() {
    const n = parseInt(localStorage.getItem("kmsh_staff_seq") || "0", 10) + 1;
    localStorage.setItem("kmsh_staff_seq", String(n));
    return "KMSH-ST-" + pad(n);
  }

  function nextDeptId() {
    const n = parseInt(localStorage.getItem("kmsh_dept_seq") || "0", 10) + 1;
    localStorage.setItem("kmsh_dept_seq", String(n));
    return "KMSH-DE-" + pad(n);
  }

  function calcAge(dob) {
    if (!dob) return "";
    const d = new Date(dob);
    if (isNaN(d.getTime())) return "";
    const diff = Date.now() - d.getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970).toString();
  }

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function fmtDate(d) {
    if (!d) return "—";
    const date = new Date(d);
    if (isNaN(date.getTime())) return d;
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }

  function fmtDateTime(d) {
    if (!d) return "—";
    const date = new Date(d);
    if (isNaN(date.getTime())) return d;
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function fmtMoney(n) {
    const v = Number(n || 0);
    return "₹" + v.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  }

  function initials(name) {
    if (!name) return "?";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0].toUpperCase())
      .join("");
  }

  function escapeHtml(s) {
    if (s == null) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function debounce(fn, wait) {
    let t;
    return function () {
      const ctx = this,
        args = arguments;
      clearTimeout(t);
      t = setTimeout(() => fn.apply(ctx, args), wait || 250);
    };
  }

  function download(filename, text, mime) {
    const blob = new Blob([text], { type: mime || "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function toCSV(rows, columns) {
    if (!rows || !rows.length) return "";
    const cols = columns || Object.keys(rows[0]);
    const header = cols.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(",");
    const body = rows
      .map((r) =>
        cols
          .map((c) => {
            const v = r[c];
            if (v == null) return '""';
            return '"' + String(v).replace(/"/g, '""') + '"';
          })
          .join(",")
      )
      .join("\n");
    return header + "\n" + body;
  }

  function exportCSV(filename, rows, columns) {
    download(filename, toCSV(rows, columns), "text/csv;charset=utf-8;");
  }

  function printArea(el) {
    const w = window.open("", "_blank");
    w.document.write(
      "<html><head><title>Print</title><style>" +
        "body{font-family:Segoe UI,Arial,sans-serif;padding:24px;color:#0f172a}" +
        "table{width:100%;border-collapse:collapse}th,td{border:1px solid #cbd5e1;padding:8px;text-align:left}" +
        "th{background:#e0f2fe}.badge{padding:2px 8px;border-radius:999px;font-size:12px}" +
        "img{max-width:120px;border-radius:8px}" +
        "</style></head><body>" +
        el.innerHTML +
        "</body></html>"
    );
    w.document.close();
    w.focus();
    setTimeout(() => {
      w.print();
      w.close();
    }, 350);
  }

  function avatarColor(seed) {
    const palette = [
      "#2563eb", "#059669", "#7c3aed", "#db2777", "#ea580c",
      "#0891b2", "#dc2626", "#ca8a04", "#4f46e5", "#16a34a",
    ];
    let h = 0;
    const s = String(seed || "");
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return palette[h % palette.length];
  }

  function avatarHtml(name, src, size) {
    size = size || 40;
    if (src) {
      return (
        '<img src="' +
        escapeHtml(src) +
        '" alt="" class="avatar" style="width:' +
        size +
        "px;height:" +
        size +
        'px" />'
      );
    }
    const bg = avatarColor(name);
    return (
      '<div class="avatar avatar-text" style="width:' +
      size +
      "px;height:" +
      size +
      "px;background:" +
      bg +
      '">' +
      escapeHtml(initials(name)) +
      "</div>"
    );
  }

  function statusBadge(status) {
    const map = {
      Admitted: "green",
      Discharged: "blue",
      Emergency: "red",
      Pending: "orange",
      Scheduled: "blue",
      "In Progress": "orange",
      Completed: "green",
      Cancelled: "red",
      Available: "green",
      "On Leave": "orange",
      Active: "green",
      Inactive: "red",
      "Low Stock": "orange",
      "Out of Stock": "red",
      Expired: "red",
      Paid: "green",
      Unpaid: "red",
      Partial: "orange",
    };
    const cls = map[status] || "blue";
    return '<span class="badge badge-' + cls + '">' + escapeHtml(status || "—") + "</span>";
  }

  function paginate(rows, page, size) {
    const total = rows.length;
    const pages = Math.max(1, Math.ceil(total / size));
    const p = Math.min(Math.max(1, page), pages);
    const start = (p - 1) * size;
    return {
      data: rows.slice(start, start + size),
      total: total,
      page: p,
      pages: pages,
      size: size,
    };
  }

  function getParam(name) {
    const u = new URL(window.location.href);
    return u.searchParams.get(name);
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  return {
    uid, pad, nextPatientId, nextDoctorId, nextAppointmentId, nextOpId,
    nextLabId, nextMedId, nextBillId, nextStaffId, nextDeptId,
    calcAge, todayISO, fmtDate, fmtDateTime, fmtMoney, initials,
    escapeHtml, debounce, download, toCSV, exportCSV, printArea,
    avatarColor, avatarHtml, statusBadge, paginate, getParam, readFileAsDataURL,
  };
})();
