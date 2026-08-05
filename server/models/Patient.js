import { query } from "../config/db.js";

export const PatientModel = {
  async findAll() { return query("SELECT * FROM patients ORDER BY created_at DESC"); },
  async findById(id) { const rows = await query("SELECT * FROM patients WHERE id = ?", [id]); return rows[0]; },
  async create(p) {
    const r = await query(
      `INSERT INTO patients (id, first_name, last_name, gender, dob, blood_group, height, weight, phone, email, address, city,
        emergency_name, emergency_number, emergency_relation, disease, diagnosis, allergies, medical_history, current_medications,
        insurance_provider, insurance_number, doctor_id, department_id, ward, bed, admission_date, discharge_date, status, notes, photo)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [p.id, p.firstName, p.lastName, p.gender, p.dob, p.bloodGroup, p.height, p.weight, p.phone, p.email, p.address, p.city,
       p.emergencyName, p.emergencyNumber, p.emergencyRelation, p.disease, p.diagnosis, p.allergies, p.medicalHistory, p.currentMedications,
       p.insuranceProvider, p.insuranceNumber, p.doctorId, p.departmentId, p.ward, p.bed, p.admissionDate, p.dischargeDate, p.status, p.notes, p.photo]
    );
    return r;
  },
  async update(id, p) {
    return query(
      `UPDATE patients SET first_name=?, last_name=?, gender=?, dob=?, blood_group=?, height=?, weight=?, phone=?, email=?, address=?, city=?,
        emergency_name=?, emergency_number=?, emergency_relation=?, disease=?, diagnosis=?, allergies=?, medical_history=?, current_medications=?,
        insurance_provider=?, insurance_number=?, doctor_id=?, department_id=?, ward=?, bed=?, admission_date=?, discharge_date=?, status=?, notes=?, photo=?, updated_at=NOW()
       WHERE id=?`,
      [p.firstName, p.lastName, p.gender, p.dob, p.bloodGroup, p.height, p.weight, p.phone, p.email, p.address, p.city,
       p.emergencyName, p.emergencyNumber, p.emergencyRelation, p.disease, p.diagnosis, p.allergies, p.medicalHistory, p.currentMedications,
       p.insuranceProvider, p.insuranceNumber, p.doctorId, p.departmentId, p.ward, p.bed, p.admissionDate, p.dischargeDate, p.status, p.notes, p.photo, id]
    );
  },
  async remove(id) { return query("DELETE FROM patients WHERE id = ?", [id]); },
};
