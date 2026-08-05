/**
 * Kushal Multi Speciality Hospital - LocalStorage data layer (Demo Mode)
 * Provides a small CRUD-like interface backed by browser LocalStorage so the
 * frontend is fully demonstrable without a backend.
 */
window.Storage = (function () {
  "use strict";

  const KEYS = {
    patients: "kmsh_patients",
    doctors: "kmsh_doctors",
    appointments: "kmsh_appointments",
    departments: "kmsh_departments",
    operations: "kmsh_operations",
    labTests: "kmsh_lab_tests",
    medicines: "kmsh_medicines",
    bills: "kmsh_bills",
    staff: "kmsh_staff",
    users: "kmsh_users",
    notifications: "kmsh_notifications",
    auditLogs: "kmsh_audit_logs",
  };

  function read(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch (e) {
      return [];
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getAll(table) {
    return read(KEYS[table] || "kmsh_" + table);
  }

  function getById(table, id) {
    return getAll(table).find((r) => String(r.id) === String(id) || String(r._id) === String(id));
  }

  function insert(table, record) {
    const rows = getAll(table);
    rows.unshift(record);
    write(KEYS[table] || "kmsh_" + table, rows);
    return record;
  }

  function update(table, id, patch) {
    const rows = getAll(table);
    const i = rows.findIndex((r) => String(r.id) === String(id) || String(r._id) === String(id));
    if (i === -1) return null;
    rows[i] = Object.assign({}, rows[i], patch, { updatedAt: new Date().toISOString() });
    write(KEYS[table] || "kmsh_" + table, rows);
    return rows[i];
  }

  function remove(table, id) {
    const rows = getAll(table).filter((r) => String(r.id) !== String(id) && String(r._id) !== String(id));
    write(KEYS[table] || "kmsh_" + table, rows);
  }

  function clear(table) {
    if (KEYS[table]) localStorage.removeItem(KEYS[table]);
  }

  function isDemoMode() {
    return localStorage.getItem(window.API_CONFIG.DEMO_FLAG_KEY) === "1";
  }

  function setDemoMode(on) {
    localStorage.setItem(window.API_CONFIG.DEMO_FLAG_KEY, on ? "1" : "0");
  }

  function addNotification(n) {
    const rows = getAll("notifications");
    rows.unshift(
      Object.assign(
        {
          id: Utils.uid("KM-N"),
          time: new Date().toISOString(),
          read: false,
        },
        n
      )
    );
    write(KEYS.notifications, rows);
  }

  function seedIfEmpty() {
    if (getAll("departments").length) return; // already seeded
    const depts = [
      "Cardiology", "Neurology", "Neurosurgery", "Orthopaedics", "General Medicine",
      "General Surgery", "Pediatrics", "Neonatology", "Obstetrics & Gynecology", "ENT",
      "Ophthalmology", "Dermatology", "Oncology", "Urology", "Nephrology",
      "Gastroenterology", "Pulmonology", "Endocrinology", "Psychiatry", "Dental",
      "Physiotherapy", "Radiology", "Emergency Medicine", "ICU", "NICU",
      "Laboratory", "Pharmacy",
    ].map((name, i) => ({
      id: "KMSH-DE-" + Utils.pad(i + 1),
      name,
      head: "",
      phone: "",
      location: "Block " + String.fromCharCode(65 + (i % 6)),
      status: "Active",
      createdAt: new Date().toISOString(),
    }));
    write(KEYS.departments, depts);

    const doctors = [
      { name: "Dr. Anjali Sharma", spec: "Cardiology", qual: "MD, DM (Cardiology)", exp: 14, fee: 1200, phone: "9810011223", email: "anjali.sharma@kmsh.in", room: "C-201", days: "Mon-Fri", time: "09:00-17:00", gender: "Female", dob: "1978-04-12", status: "Available" },
      { name: "Dr. Rohan Mehta", spec: "Neurology", qual: "MD, DM (Neurology)", exp: 11, fee: 1500, phone: "9810011224", email: "rohan.mehta@kmsh.in", room: "N-105", days: "Mon-Sat", time: "10:00-18:00", gender: "Male", dob: "1981-07-19", status: "Available" },
      { name: "Dr. Kavya Reddy", spec: "Orthopaedics", qual: "MS (Ortho)", exp: 9, fee: 900, phone: "9810011225", email: "kavya.reddy@kmsh.in", room: "O-302", days: "Mon-Fri", time: "09:00-16:00", gender: "Female", dob: "1984-02-02", status: "Available" },
      { name: "Dr. Imran Khan", spec: "General Surgery", qual: "MS, FRCS", exp: 17, fee: 1800, phone: "9810011226", email: "imran.khan@kmsh.in", room: "S-110", days: "Mon-Sat", time: "08:00-15:00", gender: "Male", dob: "1974-11-25", status: "On Leave" },
      { name: "Dr. Priya Nair", spec: "Pediatrics", qual: "MD (Paed)", exp: 8, fee: 700, phone: "9810011227", email: "priya.nair@kmsh.in", room: "P-204", days: "Mon-Fri", time: "09:00-17:00", gender: "Female", dob: "1986-06-14", status: "Available" },
      { name: "Dr. Vikram Singh", spec: "Oncology", qual: "MD, DM (Onco)", exp: 19, fee: 2200, phone: "9810011228", email: "vikram.singh@kmsh.in", room: "Onc-01", days: "Mon-Fri", time: "10:00-16:00", gender: "Male", dob: "1972-03-30", status: "Available" },
    ].map((d, i) => Object.assign(
      {
        id: "KMSH-D-" + Utils.pad(i + 1),
        photo: "",
        license: "MCI-" + (10000 + i),
        languages: "English, Hindi",
        bio: "Senior consultant committed to compassionate, evidence-based care.",
        certifications: "Fellowship in " + d.spec,
        awards: "Best Consultant " + (2020 + i),
        createdAt: new Date().toISOString(),
      },
      d
    ));
    write(KEYS.doctors, doctors);
    localStorage.setItem("kmsh_doctor_seq", String(doctors.length));

    const patients = [
      { firstName: "Suresh", lastName: "Patel", gender: "Male", dob: "1962-01-10", blood: "B+", disease: "Coronary Artery Disease", doctor: doctors[0].name, department: "Cardiology", ward: "Cardiac Ward", bed: "C-12", status: "Admitted", phone: "9820010001", city: "Pune" },
      { firstName: "Meena", lastName: "Iyer", gender: "Female", dob: "1989-03-22", blood: "O+", disease: "Migraine", doctor: doctors[1].name, department: "Neurology", ward: "Neuro Ward", bed: "N-04", status: "Pending", phone: "9820010002", city: "Chennai" },
      { firstName: "Arjun", lastName: "Das", gender: "Male", dob: "1995-09-15", blood: "A+", disease: "Fracture", doctor: doctors[2].name, department: "Orthopaedics", ward: "Ortho Ward", bed: "O-08", status: "Discharged", phone: "9820010003", city: "Kolkata" },
      { firstName: "Fatima", lastName: "Sheikh", gender: "Female", dob: "2001-12-01", blood: "AB+", disease: "Appendicitis", doctor: doctors[3].name, department: "General Surgery", ward: "Surgical Ward", bed: "S-02", status: "Admitted", phone: "9820010004", city: "Hyderabad" },
      { firstName: "Rahul", lastName: "Verma", gender: "Male", dob: "2018-05-05", blood: "O-", disease: "Bronchitis", doctor: doctors[4].name, department: "Pediatrics", ward: "Paed Ward", bed: "P-06", status: "Emergency", phone: "9820010005", city: "Delhi" },
    ].map((p, i) => Object.assign(
      {
        id: "KMSH-P-" + Utils.pad(i + 1),
        photo: "",
        address: "Street " + (i + 1) + ", " + p.city,
        emergencyName: p.firstName + " (Father)",
        emergencyNumber: p.phone,
        emergencyRelation: "Father",
        diagnosis: p.disease + " — under observation",
        allergies: "None",
        history: "Hypertension",
        medications: "Aspirin 75mg",
        insuranceProvider: "Star Health",
        insuranceNumber: "SH-" + (20000 + i),
        admissionDate: Utils.todayISO(),
        dischargeDate: "",
        notes: "",
        height: "",
        weight: "",
        email: (p.firstName + "." + p.lastName + "@example.com").toLowerCase(),
        createdAt: new Date().toISOString(),
      },
      p
    ));
    write(KEYS.patients, patients);
    localStorage.setItem("kmsh_patient_seq", String(patients.length));

    const meds = [
      { name: "Paracetamol 500mg", category: "Analgesic", supplier: "Cipla", batch: "B2024-01", qty: 1200, price: 5, expiry: "2026-08-01", status: "In Stock" },
      { name: "Amoxicillin 250mg", category: "Antibiotic", supplier: "Sun Pharma", batch: "B2024-02", qty: 40, price: 18, expiry: "2025-12-01", status: "Low Stock" },
      { name: "Atorvastatin 10mg", category: "Statin", supplier: "Lupin", batch: "B2024-03", qty: 300, price: 35, expiry: "2027-01-01", status: "In Stock" },
      { name: "Metformin 500mg", category: "Antidiabetic", supplier: "USV", batch: "B2023-09", qty: 0, price: 12, expiry: "2024-10-01", status: "Expired" },
      { name: "Ondansetron 4mg", category: "Anti-emetic", supplier: "Cipla", batch: "B2024-04", qty: 220, price: 9, expiry: "2026-05-01", status: "In Stock" },
    ].map((m, i) => Object.assign({ id: "KMSH-M-" + Utils.pad(i + 1), createdAt: new Date().toISOString() }, m));
    write(KEYS.medicines, meds);
    localStorage.setItem("kmsh_med_seq", String(meds.length));

    const staff = [
      { name: "Sunita Williams", role: "Nurse", department: "ICU", phone: "9830010001", email: "sunita.w@kmsh.in", joining: "2021-06-01", status: "Active" },
      { name: "Arvind Kumar", role: "Lab Technician", department: "Laboratory", phone: "9830010002", email: "arvind.k@kmsh.in", joining: "2022-03-15", status: "Active" },
      { name: "Deepa Joshi", role: "Receptionist", department: "General Medicine", phone: "9830010003", email: "deepa.j@kmsh.in", joining: "2023-01-10", status: "Active" },
      { name: "Manoj Pillai", role: "Pharmacist", department: "Pharmacy", phone: "9830010004", email: "manoj.p@kmsh.in", joining: "2020-11-20", status: "Active" },
    ].map((s, i) => Object.assign({ id: "KMSH-ST-" + Utils.pad(i + 1), photo: "", createdAt: new Date().toISOString() }, s));
    write(KEYS.staff, staff);
    localStorage.setItem("kmsh_staff_seq", String(staff.length));

    const bills = [
      { patient: patients[0].name, patientId: patients[0].id, consultation: 1200, lab: 800, surgery: 0, pharmacy: 450, room: 2000, insurance: 0, discount: 100, total: 4350, paid: 4350, balance: 0, status: "Paid", date: Utils.todayISO() },
      { patient: patients[3].name, patientId: patients[3].id, consultation: 1800, lab: 1500, surgery: 25000, pharmacy: 900, room: 3500, insurance: 15000, discount: 500, total: 32200, paid: 15000, balance: 17200, status: "Partial", date: Utils.todayISO() },
    ].map((b, i) => Object.assign({ id: "KMSH-B-" + Utils.pad(i + 1), createdAt: new Date().toISOString() }, b));
    write(KEYS.bills, bills);
    localStorage.setItem("kmsh_bill_seq", String(bills.length));

    const labs = [
      { patient: patients[0].name, patientId: patients[0].id, doctor: doctors[0].name, test: "ECG", status: "Completed", date: Utils.todayISO(), report: "" },
      { patient: patients[1].name, patientId: patients[1].id, doctor: doctors[1].name, test: "MRI Brain", status: "Pending", date: Utils.todayISO(), report: "" },
      { patient: patients[4].name, patientId: patients[4].id, doctor: doctors[4].name, test: "Blood Test", status: "In Progress", date: Utils.todayISO(), report: "" },
    ].map((l, i) => Object.assign({ id: "KMSH-L-" + Utils.pad(i + 1), createdAt: new Date().toISOString() }, l));
    write(KEYS.labTests, labs);
    localStorage.setItem("kmsh_lab_seq", String(labs.length));

    const ops = [
      { patient: patients[3].name, patientId: patients[3].id, leadDoctor: doctors[3].name, department: "General Surgery", theatre: "OT-1", date: Utils.todayISO(), start: "10:00", end: "12:30", type: "Laparoscopic Appendectomy", status: "Scheduled", cost: 25000, notes: "" },
    ].map((o, i) => Object.assign({ id: "KMSH-S-" + Utils.pad(i + 1), createdAt: new Date().toISOString() }, o));
    write(KEYS.operations, ops);
    localStorage.setItem("kmsh_op_seq", String(ops.length));

    const appts = [
      { patient: patients[1].name, patientId: patients[1].id, doctor: doctors[1].name, department: "Neurology", date: Utils.todayISO(), time: "11:00", reason: "Severe headache", status: "Pending", notes: "" },
      { patient: patients[0].name, patientId: patients[0].id, doctor: doctors[0].name, department: "Cardiology", date: Utils.todayISO(), time: "09:30", reason: "Follow-up", status: "Completed", notes: "" },
    ].map((a, i) => Object.assign({ id: "KMSH-A-" + Utils.pad(i + 1), createdAt: new Date().toISOString() }, a));
    write(KEYS.appointments, appts);
    localStorage.setItem("kmsh_appt_seq", String(appts.length));

    const users = [
      { id: 1, name: "Admin", email: "admin@kmsh.in", password: "admin123", role: "Administrator", status: "Active", createdAt: new Date().toISOString() },
      { id: 2, name: "Dr. Anjali Sharma", email: "doctor@kmsh.in", password: "doctor123", role: "Doctor", status: "Active", createdAt: new Date().toISOString() },
      { id: 3, name: "Deepa Joshi", email: "reception@kmsh.in", password: "reception123", role: "Receptionist", status: "Active", createdAt: new Date().toISOString() },
    ];
    write(KEYS.users, users);

    addNotification({ type: "info", title: "Welcome to Kushal Multi Speciality Hospital", message: "Sample demonstration data has been loaded." });
  }

  return {
    KEYS, getAll, getById, insert, update, remove, clear,
    isDemoMode, setDemoMode, addNotification, seedIfEmpty,
  };
})();
