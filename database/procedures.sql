-- ============================================================
-- Kushal Multi Speciality Hospital — Stored Procedures
-- ============================================================
USE kushal_hospital;

DELIMITER $$

-- Add a patient with auto-generated hospital ID
CREATE PROCEDURE sp_add_patient(
  IN p_first VARCHAR(80), IN p_last VARCHAR(80), IN p_gender VARCHAR(10),
  IN p_dob DATE, IN p_blood VARCHAR(5), IN p_phone VARCHAR(20),
  IN p_disease VARCHAR(160), IN p_dept VARCHAR(20), IN p_doctor VARCHAR(20),
  IN p_status VARCHAR(20)
)
BEGIN
  DECLARE v_id VARCHAR(20);
  DECLARE v_seq INT;
  SELECT COALESCE(MAX(CAST(SUBSTRING(id, 8) AS UNSIGNED)), 0) + 1 INTO v_seq FROM patients;
  SET v_id = CONCAT('KMSH-P-', LPAD(v_seq, 6, '0'));
  INSERT INTO patients (id, first_name, last_name, gender, dob, blood_group, phone, disease, department_id, doctor_id, status, admission_date)
  VALUES (v_id, p_first, p_last, p_gender, p_dob, p_blood, p_phone, p_disease, p_dept, p_doctor, p_status, CURDATE());
  SELECT v_id AS patient_id;
END$$

-- Add a doctor with auto-generated hospital ID
CREATE PROCEDURE sp_add_doctor(
  IN d_name VARCHAR(120), IN d_spec VARCHAR(120), IN d_qual VARCHAR(160),
  IN d_dept VARCHAR(20), IN d_exp INT, IN d_fee DECIMAL(10,2), IN d_phone VARCHAR(20)
)
BEGIN
  DECLARE v_id VARCHAR(20);
  DECLARE v_seq INT;
  SELECT COALESCE(MAX(CAST(SUBSTRING(id, 8) AS UNSIGNED)), 0) + 1 INTO v_seq FROM doctors;
  SET v_id = CONCAT('KMSH-D-', LPAD(v_seq, 6, '0'));
  INSERT INTO doctors (id, name, specialization, qualification, department_id, experience, consultation_fee, phone, status)
  VALUES (v_id, d_name, d_spec, d_qual, d_dept, d_exp, d_fee, d_phone, 'Available');
  SELECT v_id AS doctor_id;
END$$

-- Book an appointment (validates patient + doctor exist)
CREATE PROCEDURE sp_book_appointment(
  IN a_patient VARCHAR(20), IN a_doctor VARCHAR(20), IN a_date DATE, IN a_time TIME, IN a_reason VARCHAR(255)
)
BEGIN
  DECLARE v_id VARCHAR(20);
  DECLARE v_seq INT;
  IF NOT EXISTS (SELECT 1 FROM patients WHERE id = a_patient) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Patient not found';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM doctors WHERE id = a_doctor) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Doctor not found';
  END IF;
  SELECT COALESCE(MAX(CAST(SUBSTRING(id, 8) AS UNSIGNED)), 0) + 1 INTO v_seq FROM appointments;
  SET v_id = CONCAT('KMSH-A-', LPAD(v_seq, 6, '0'));
  INSERT INTO appointments (id, patient_id, doctor_id, date, time, reason, status)
  VALUES (v_id, a_patient, a_doctor, a_date, a_time, a_reason, 'Pending');
  SELECT v_id AS appointment_id;
END$$

-- Generate a bill (computes total, balance, status in a transaction)
CREATE PROCEDURE sp_generate_bill(
  IN b_patient VARCHAR(20), IN b_consult DECIMAL(10,2), IN b_lab DECIMAL(10,2),
  IN b_surgery DECIMAL(10,2), IN b_pharm DECIMAL(10,2), IN b_room DECIMAL(10,2),
  IN b_ins DECIMAL(10,2), IN b_disc DECIMAL(10,2), IN b_paid DECIMAL(12,2)
)
BEGIN
  DECLARE v_id VARCHAR(20);
  DECLARE v_seq INT;
  DECLARE v_total DECIMAL(12,2);
  DECLARE v_balance DECIMAL(12,2);
  DECLARE v_status VARCHAR(10);
  SET v_total = b_consult + b_lab + b_surgery + b_pharm + b_room - b_ins - b_disc;
  SET v_balance = v_total - b_paid;
  IF v_balance <= 0 THEN SET v_status = 'Paid';
  ELSEIF b_paid > 0 THEN SET v_status = 'Partial';
  ELSE SET v_status = 'Unpaid';
  END IF;
  SELECT COALESCE(MAX(CAST(SUBSTRING(id, 8) AS UNSIGNED)), 0) + 1 INTO v_seq FROM billing;
  SET v_id = CONCAT('KMSH-B-', LPAD(v_seq, 6, '0'));
  INSERT INTO billing (id, patient_id, date, consultation, lab, surgery, pharmacy, room, insurance, discount, total, paid, balance, status)
  VALUES (v_id, b_patient, CURDATE(), b_consult, b_lab, b_surgery, b_pharm, b_room, b_ins, b_disc, v_total, b_paid, v_balance, v_status);
  SELECT v_id AS bill_id, v_total AS total, v_balance AS balance, v_status AS status;
END$$

-- Patient history: appointments + lab tests for a patient
CREATE PROCEDURE sp_patient_history(IN p_id VARCHAR(20))
BEGIN
  SELECT 'Appointment' AS type, a.date, a.status, a.reason AS detail
  FROM appointments a WHERE a.patient_id = p_id
  UNION ALL
  SELECT 'Lab Test', l.date, l.status, l.test_name
  FROM laboratory_tests l WHERE l.patient_id = p_id
  ORDER BY date DESC;
END$$

-- Doctor appointment report
CREATE PROCEDURE sp_doctor_appointment_report(IN d_id VARCHAR(20))
BEGIN
  SELECT a.id, CONCAT(p.first_name,' ',p.last_name) AS patient, a.date, a.time, a.reason, a.status
  FROM appointments a
  JOIN patients p ON a.patient_id = p.id
  WHERE a.doctor_id = d_id
  ORDER BY a.date DESC, a.time DESC;
END$$

DELIMITER ;
