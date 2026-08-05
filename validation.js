/**
 * Kushal Multi Speciality Hospital - Form validation + toast notifications
 */
window.Validation = (function () {
  "use strict";

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRe = /^[0-9+\-\s()]{7,15}$/;

  function isEmail(v) { return emailRe.test(v); }
  function isPhone(v) { return phoneRe.test(v); }
  function required(v) { return v != null && String(v).trim() !== ""; }

  function validatePatient(f) {
    const errs = [];
    if (!required(f.firstName)) errs.push("First name is required");
    if (!required(f.lastName)) errs.push("Last name is required");
    if (!required(f.gender)) errs.push("Gender is required");
    if (!required(f.dob)) errs.push("Date of birth is required");
    if (!required(f.phone)) errs.push("Phone is required");
    else if (!isPhone(f.phone)) errs.push("Phone number is invalid");
    if (f.email && !isEmail(f.email)) errs.push("Email is invalid");
    if (!required(f.department)) errs.push("Department is required");
    if (!required(f.status)) errs.push("Status is required");
    return errs;
  }

  function validateDoctor(f) {
    const errs = [];
    if (!required(f.name)) errs.push("Doctor name is required");
    if (!required(f.spec)) errs.push("Specialization is required");
    if (!required(f.qual)) errs.push("Qualification is required");
    if (!required(f.phone)) errs.push("Phone is required");
    else if (!isPhone(f.phone)) errs.push("Phone number is invalid");
    if (f.email && !isEmail(f.email)) errs.push("Email is invalid");
    if (!required(f.department)) errs.push("Department is required");
    return errs;
  }

  function validateAppointment(f) {
    const errs = [];
    if (!required(f.patient)) errs.push("Patient is required");
    if (!required(f.doctor)) errs.push("Doctor is required");
    if (!required(f.date)) errs.push("Date is required");
    if (!required(f.time)) errs.push("Time is required");
    return errs;
  }

  function validateUser(f) {
    const errs = [];
    if (!required(f.name)) errs.push("Name is required");
    if (!required(f.email)) errs.push("Email is required");
    else if (!isEmail(f.email)) errs.push("Email is invalid");
    if (!required(f.password)) errs.push("Password is required");
    else if (f.password.length < 6) errs.push("Password must be at least 6 characters");
    return errs;
  }

  function validateMedicine(f) {
    const errs = [];
    if (!required(f.name)) errs.push("Medicine name is required");
    if (!required(f.category)) errs.push("Category is required");
    if (!required(f.supplier)) errs.push("Supplier is required");
    if (f.qty == null || isNaN(Number(f.qty)) || Number(f.qty) < 0) errs.push("Quantity is invalid");
    if (f.price == null || isNaN(Number(f.price)) || Number(f.price) < 0) errs.push("Price is invalid");
    if (!required(f.expiry)) errs.push("Expiry date is required");
    return errs;
  }

  function validateBill(f) {
    const errs = [];
    if (!required(f.patient)) errs.push("Patient is required");
    return errs;
  }

  // Toasts
  function toast(message, type) {
    type = type || "info";
    let host = document.getElementById("toastHost");
    if (!host) {
      host = document.createElement("div");
      host.id = "toastHost";
      host.className = "toast-host";
      document.body.appendChild(host);
    }
    const icons = { success: "fa-circle-check", error: "fa-circle-exclamation", info: "fa-circle-info", warning: "fa-triangle-exclamation" };
    const el = document.createElement("div");
    el.className = "toast toast-" + type;
    el.innerHTML = '<i class="fa-solid ' + (icons[type] || icons.info) + '"></i><span>' + Utils.escapeHtml(message) + "</span>";
    host.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 300);
    }, 3800);
  }

  return {
    isEmail, isPhone, required,
    validatePatient, validateDoctor, validateAppointment, validateUser, validateMedicine, validateBill,
    toast,
  };
})();
