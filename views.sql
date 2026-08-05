-- ============================================================
-- Kushal Multi Speciality Hospital — SQL Views
-- ============================================================
USE kushal_hospital;

-- patient_summary: key patient info with doctor and department names
CREATE OR REPLACE VIEW patient_summary AS
SELECT p.id, CONCAT(p.first_name, ' ', p.last_name) AS name, p.gender, p.dob,
       TIMESTAMPDIFF(YEAR, p.dob, CURDATE()) AS age, p.blood_group, p.phone,
       p.disease, d.name AS doctor, dep.name AS department, p.status,
       p.admission_date, p.discharge_date
FROM patients p
LEFT JOIN doctors d ON p.doctor_id = d.id
LEFT JOIN departments dep ON p.department_id = dep.id;

-- doctor_summary: doctor with department and computed load
CREATE OR REPLACE VIEW doctor_summary AS
SELECT d.id, d.name, d.specialization, d.qualification, dep.name AS department,
       d.experience, d.consultation_fee, d.status,
       (SELECT COUNT(*) FROM patients p WHERE p.doctor_id = d.id) AS patient_count,
       (SELECT COUNT(*) FROM appointments a WHERE a.doctor_id = d.id) AS appointment_count
FROM doctors d
LEFT JOIN departments dep ON d.department_id = dep.id;

-- appointment_summary: appointment with patient and doctor names
CREATE OR REPLACE VIEW appointment_summary AS
SELECT a.id, CONCAT(p.first_name, ' ', p.last_name) AS patient, d.name AS doctor,
       dep.name AS department, a.date, a.time, a.reason, a.status
FROM appointments a
JOIN patients p ON a.patient_id = p.id
JOIN doctors d ON a.doctor_id = d.id
LEFT JOIN departments dep ON a.department_id = dep.id;

-- department_statistics: per-department counts and revenue
CREATE OR REPLACE VIEW department_statistics AS
SELECT dep.id, dep.name,
  (SELECT COUNT(*) FROM doctors d WHERE d.department_id = dep.id) AS doctor_count,
  (SELECT COUNT(*) FROM patients p WHERE p.department_id = dep.id) AS patient_count,
  (SELECT COUNT(*) FROM appointments a WHERE a.department_id = dep.id) AS appointment_count,
  (SELECT COALESCE(SUM(b.total), 0) FROM billing b
     JOIN patients p ON b.patient_id = p.id WHERE p.department_id = dep.id) AS total_revenue
FROM departments dep;

-- billing_summary: bill with patient name and computed balance status
CREATE OR REPLACE VIEW billing_summary AS
SELECT b.id, CONCAT(p.first_name, ' ', p.last_name) AS patient, b.date,
       b.consultation, b.lab, b.surgery, b.pharmacy, b.room,
       b.insurance, b.discount, b.gst, b.total, b.paid, b.balance, b.status
FROM billing b
JOIN patients p ON b.patient_id = p.id;
