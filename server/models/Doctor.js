import { query } from "../config/db.js";

export const DoctorModel = {
  async findAll() { return query("SELECT * FROM doctors ORDER BY created_at DESC"); },
  async findById(id) { const rows = await query("SELECT * FROM doctors WHERE id = ?", [id]); return rows[0]; },
  async create(d) {
    return query(
      `INSERT INTO doctors (id, name, gender, dob, qualification, specialization, department_id, experience, license_number, phone, email, address, room, consultation_fee, available_days, available_time, languages, bio, certifications, awards, status, photo)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [d.id, d.name, d.gender, d.dob, d.qualification, d.specialization, d.departmentId, d.experience, d.licenseNumber, d.phone, d.email, d.address, d.room, d.consultationFee, d.availableDays, d.availableTime, d.languages, d.bio, d.certifications, d.awards, d.status, d.photo]
    );
  },
  async update(id, d) {
    return query(
      `UPDATE doctors SET name=?, gender=?, dob=?, qualification=?, specialization=?, department_id=?, experience=?, license_number=?, phone=?, email=?, address=?, room=?, consultation_fee=?, available_days=?, available_time=?, languages=?, bio=?, certifications=?, awards=?, status=?, photo=?, updated_at=NOW() WHERE id=?`,
      [d.name, d.gender, d.dob, d.qualification, d.specialization, d.departmentId, d.experience, d.licenseNumber, d.phone, d.email, d.address, d.room, d.consultationFee, d.availableDays, d.availableTime, d.languages, d.bio, d.certifications, d.awards, d.status, d.photo, id]
    );
  },
  async remove(id) { return query("DELETE FROM doctors WHERE id = ?", [id]); },
};
