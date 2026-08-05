import { query } from "../config/db.js";

export const AppointmentModel = {
  async findAll() { return query("SELECT * FROM appointments ORDER BY date DESC, time DESC"); },
  async findById(id) { const rows = await query("SELECT * FROM appointments WHERE id = ?", [id]); return rows[0]; },
  async create(a) {
    return query(
      `INSERT INTO appointments (id, patient_id, doctor_id, department_id, date, time, reason, status, notes)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [a.id, a.patientId, a.doctorId, a.departmentId, a.date, a.time, a.reason, a.status, a.notes]
    );
  },
  async update(id, a) {
    return query(`UPDATE appointments SET patient_id=?, doctor_id=?, department_id=?, date=?, time=?, reason=?, status=?, notes=?, updated_at=NOW() WHERE id=?`,
      [a.patientId, a.doctorId, a.departmentId, a.date, a.time, a.reason, a.status, a.notes, id]);
  },
  async remove(id) { return query("DELETE FROM appointments WHERE id = ?", [id]); },
};

export const DepartmentModel = {
  async findAll() { return query("SELECT * FROM departments ORDER BY name"); },
  async findById(id) { const rows = await query("SELECT * FROM departments WHERE id = ?", [id]); return rows[0]; },
  async create(d) { return query("INSERT INTO departments (id, name, head, phone, location, status) VALUES (?,?,?,?,?,?)", [d.id, d.name, d.head, d.phone, d.location, d.status]); },
  async update(id, d) { return query("UPDATE departments SET name=?, head=?, phone=?, location=?, status=?, updated_at=NOW() WHERE id=?", [d.name, d.head, d.phone, d.location, d.status, id]); },
  async remove(id) { return query("DELETE FROM departments WHERE id = ?", [id]); },
};

export const OperationModel = {
  async findAll() { return query("SELECT * FROM operations ORDER BY date DESC"); },
  async findById(id) { const rows = await query("SELECT * FROM operations WHERE id = ?", [id]); return rows[0]; },
  async create(o) {
    return query("INSERT INTO operations (id, patient_id, lead_doctor_id, department_id, theatre, date, start_time, end_time, type, cost, status, notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
      [o.id, o.patientId, o.leadDoctorId, o.departmentId, o.theatre, o.date, o.start, o.end, o.type, o.cost, o.status, o.notes]);
  },
  async update(id, o) {
    return query("UPDATE operations SET patient_id=?, lead_doctor_id=?, department_id=?, theatre=?, date=?, start_time=?, end_time=?, type=?, cost=?, status=?, notes=?, updated_at=NOW() WHERE id=?",
      [o.patientId, o.leadDoctorId, o.departmentId, o.theatre, o.date, o.start, o.end, o.type, o.cost, o.status, o.notes, id]);
  },
  async remove(id) { return query("DELETE FROM operations WHERE id = ?", [id]); },
};

export const LabTestModel = {
  async findAll() { return query("SELECT * FROM laboratory_tests ORDER BY date DESC"); },
  async findById(id) { const rows = await query("SELECT * FROM laboratory_tests WHERE id = ?", [id]); return rows[0]; },
  async create(l) { return query("INSERT INTO laboratory_tests (id, patient_id, doctor_id, test_name, date, status, report_url) VALUES (?,?,?,?,?,?,?)", [l.id, l.patientId, l.doctorId, l.test, l.date, l.status, l.report]); },
  async update(id, l) { return query("UPDATE laboratory_tests SET patient_id=?, doctor_id=?, test_name=?, date=?, status=?, report_url=?, updated_at=NOW() WHERE id=?", [l.patientId, l.doctorId, l.test, l.date, l.status, l.report, id]); },
  async remove(id) { return query("DELETE FROM laboratory_tests WHERE id = ?", [id]); },
};

export const MedicineModel = {
  async findAll() { return query("SELECT * FROM medicines ORDER BY name"); },
  async findById(id) { const rows = await query("SELECT * FROM medicines WHERE id = ?", [id]); return rows[0]; },
  async create(m) { return query("INSERT INTO medicines (id, name, category, supplier, batch_number, quantity, price, expiry_date, status) VALUES (?,?,?,?,?,?,?,?,?)", [m.id, m.name, m.category, m.supplier, m.batch, m.qty, m.price, m.expiry, m.status]); },
  async update(id, m) { return query("UPDATE medicines SET name=?, category=?, supplier=?, batch_number=?, quantity=?, price=?, expiry_date=?, status=?, updated_at=NOW() WHERE id=?", [m.name, m.category, m.supplier, m.batch, m.qty, m.price, m.expiry, m.status, id]); },
  async remove(id) { return query("DELETE FROM medicines WHERE id = ?", [id]); },
};

export const BillModel = {
  async findAll() { return query("SELECT * FROM billing ORDER BY date DESC"); },
  async findById(id) { const rows = await query("SELECT * FROM billing WHERE id = ?", [id]); return rows[0]; },
  async create(b) {
    return query("INSERT INTO billing (id, patient_id, date, consultation, lab, surgery, pharmacy, room, insurance, discount, gst, total, paid, balance, status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [b.id, b.patientId, b.date, b.consultation, b.lab, b.surgery, b.pharmacy, b.room, b.insurance, b.discount, b.gst, b.total, b.paid, b.balance, b.status]);
  },
  async update(id, b) {
    return query("UPDATE billing SET patient_id=?, date=?, consultation=?, lab=?, surgery=?, pharmacy=?, room=?, insurance=?, discount=?, gst=?, total=?, paid=?, balance=?, status=?, updated_at=NOW() WHERE id=?",
      [b.patientId, b.date, b.consultation, b.lab, b.surgery, b.pharmacy, b.room, b.insurance, b.discount, b.gst, b.total, b.paid, b.balance, b.status, id]);
  },
  async remove(id) { return query("DELETE FROM billing WHERE id = ?", [id]); },
};

export const StaffModel = {
  async findAll() { return query("SELECT * FROM staff ORDER BY name"); },
  async findById(id) { const rows = await query("SELECT * FROM staff WHERE id = ?", [id]); return rows[0]; },
  async create(s) { return query("INSERT INTO staff (id, name, role, department_id, phone, email, joining_date, status, photo) VALUES (?,?,?,?,?,?,?,?,?)", [s.id, s.name, s.role, s.departmentId, s.phone, s.email, s.joining, s.status, s.photo]); },
  async update(id, s) { return query("UPDATE staff SET name=?, role=?, department_id=?, phone=?, email=?, joining_date=?, status=?, photo=?, updated_at=NOW() WHERE id=?", [s.name, s.role, s.departmentId, s.phone, s.email, s.joining, s.status, s.photo, id]); },
  async remove(id) { return query("DELETE FROM staff WHERE id = ?", [id]); },
};

export const NotificationModel = {
  async findAll() { return query("SELECT * FROM notifications ORDER BY created_at DESC"); },
  async create(n) { return query("INSERT INTO notifications (id, type, title, message, read) VALUES (?,?,?,?,?)", [n.id, n.type, n.title, n.message, n.read ? 1 : 0]); },
  async markRead(id) { return query("UPDATE notifications SET read=1 WHERE id=?", [id]); },
  async markAllRead() { return query("UPDATE notifications SET read=1"); },
};

export const UserModel = {
  async findAll() { return query("SELECT id, name, email, role, status, created_at FROM users ORDER BY id"); },
  async findByEmail(email) { const rows = await query("SELECT * FROM users WHERE email = ?", [email]); return rows[0]; },
  async findById(id) { const rows = await query("SELECT id, name, email, role, status FROM users WHERE id = ?", [id]); return rows[0]; },
  async create(u) { return query("INSERT INTO users (name, email, password, role, status) VALUES (?,?,?,?,?)", [u.name, u.email, u.password, u.role, u.status || "Active"]); },
};
