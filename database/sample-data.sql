-- ============================================================
-- Kushal Multi Speciality Hospital — Sample Data
-- Run AFTER schema.sql
-- ============================================================
USE kushal_hospital;

-- Default admin user. Password: admin123 (bcrypt hash below)
INSERT INTO users (name, email, password, role, status) VALUES
('Administrator', 'admin@kmsh.in', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQDqoZ8Vq1eH8QvL9p1xRq2eH8QvL9e', 'Administrator', 'Active'),
('Dr. Anjali Sharma', 'doctor@kmsh.in', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQDqoZ8Vq1eH8QvL9p1xRq2eH8QvL9e', 'Doctor', 'Active'),
('Deepa Joshi', 'reception@kmsh.in', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQDqoZ8Vq1eH8QvL9p1xRq2eH8QvL9e', 'Receptionist', 'Active');

-- Departments
INSERT INTO departments (id, name, head, phone, location, status) VALUES
('KMSH-DE-000001','Cardiology','Dr. Anjali Sharma','101','Block A','Active'),
('KMSH-DE-000002','Neurology','Dr. Rohan Mehta','102','Block A','Active'),
('KMSH-DE-000003','Orthopaedics','Dr. Kavya Reddy','103','Block B','Active'),
('KMSH-DE-000004','General Surgery','Dr. Imran Khan','104','Block B','Active'),
('KMSH-DE-000005','Pediatrics','Dr. Priya Nair','105','Block C','Active'),
('KMSH-DE-000006','Oncology','Dr. Vikram Singh','106','Block D','Active'),
('KMSH-DE-000007','ICU',NULL,'107','Block E','Active'),
('KMSH-DE-000008','Pharmacy',NULL,'108','Block F','Active'),
('KMSH-DE-000009','Laboratory',NULL,'109','Block F','Active');

-- Doctors
INSERT INTO doctors (id, name, gender, dob, qualification, specialization, department_id, experience, license_number, phone, email, room, consultation_fee, available_days, available_time, languages, bio, status) VALUES
('KMSH-D-000001','Dr. Anjali Sharma','Female','1978-04-12','MD, DM (Cardiology)','Cardiology','KMSH-DE-000001',14,'MCI-10001','9810011223','anjali.sharma@kmsh.in','C-201',1200,'Mon-Fri','09:00-17:00','English, Hindi','Senior cardiologist.','Available'),
('KMSH-D-000002','Dr. Rohan Mehta','Male','1981-07-19','MD, DM (Neurology)','Neurology','KMSH-DE-000002',11,'MCI-10002','9810011224','rohan.mehta@kmsh.in','N-105',1500,'Mon-Sat','10:00-18:00','English, Hindi','Neurology consultant.','Available'),
('KMSH-D-000003','Dr. Kavya Reddy','Female','1984-02-02','MS (Ortho)','Orthopaedics','KMSH-DE-000003',9,'MCI-10003','9810011225','kavya.reddy@kmsh.in','O-302',900,'Mon-Fri','09:00-16:00','English, Telugu','Orthopaedic surgeon.','Available'),
('KMSH-D-000004','Dr. Imran Khan','Male','1974-11-25','MS, FRCS','General Surgery','KMSH-DE-000004',17,'MCI-10004','9810011226','imran.khan@kmsh.in','S-110',1800,'Mon-Sat','08:00-15:00','English, Urdu','General surgeon.','On Leave'),
('KMSH-D-000005','Dr. Priya Nair','Female','1986-06-14','MD (Paed)','Pediatrics','KMSH-DE-000005',8,'MCI-10005','9810011227','priya.nair@kmsh.in','P-204',700,'Mon-Fri','09:00-17:00','English, Malayalam','Paediatrician.','Available'),
('KMSH-D-000006','Dr. Vikram Singh','Male','1972-03-30','MD, DM (Onco)','Oncology','KMSH-DE-000006',19,'MCI-10006','9810011228','vikram.singh@kmsh.in','Onc-01',2200,'Mon-Fri','10:00-16:00','English, Punjabi','Oncology specialist.','Available');

-- Patients
INSERT INTO patients (id, first_name, last_name, gender, dob, blood_group, phone, city, disease, doctor_id, department_id, ward, bed, admission_date, status) VALUES
('KMSH-P-000001','Suresh','Patel','Male','1962-01-10','B+','9820010001','Pune','Coronary Artery Disease','KMSH-D-000001','KMSH-DE-000001','Cardiac Ward','C-12','2026-08-04','Admitted'),
('KMSH-P-000002','Meena','Iyer','Female','1989-03-22','O+','9820010002','Chennai','Migraine','KMSH-D-000002','KMSH-DE-000002','Neuro Ward','N-04','2026-08-04','Pending'),
('KMSH-P-000003','Arjun','Das','Male','1995-09-15','A+','9820010003','Kolkata','Fracture','KMSH-D-000003','KMSH-DE-000003','Ortho Ward','O-08','2026-07-28','Discharged'),
('KMSH-P-000004','Fatima','Sheikh','Female','2001-12-01','AB+','9820010004','Hyderabad','Appendicitis','KMSH-D-000004','KMSH-DE-000004','Surgical Ward','S-02','2026-08-04','Admitted'),
('KMSH-P-000005','Rahul','Verma','Male','2018-05-05','O-','9820010005','Delhi','Bronchitis','KMSH-D-000005','KMSH-DE-000005','Paed Ward','P-06','2026-08-04','Emergency');

-- Staff
INSERT INTO staff (id, name, role, department_id, phone, email, joining_date, status) VALUES
('KMSH-ST-000001','Sunita Williams','Nurse','KMSH-DE-000007','9830010001','sunita.w@kmsh.in','2021-06-01','Active'),
('KMSH-ST-000002','Arvind Kumar','Lab Technician','KMSH-DE-000009','9830010002','arvind.k@kmsh.in','2022-03-15','Active'),
('KMSH-ST-000003','Deepa Joshi','Receptionist','KMSH-DE-000001','9830010003','deepa.j@kmsh.in','2023-01-10','Active'),
('KMSH-ST-000004','Manoj Pillai','Pharmacist','KMSH-DE-000008','9830010004','manoj.p@kmsh.in','2020-11-20','Active');

-- Appointments
INSERT INTO appointments (id, patient_id, doctor_id, department_id, date, time, reason, status) VALUES
('KMSH-A-000001','KMSH-P-000002','KMSH-D-000002','KMSH-DE-000002','2026-08-04','11:00','Severe headache','Pending'),
('KMSH-A-000002','KMSH-P-000001','KMSH-D-000001','KMSH-DE-000001','2026-08-04','09:30','Follow-up','Completed');

-- Operations
INSERT INTO operations (id, patient_id, lead_doctor_id, department_id, theatre, date, start_time, end_time, type, cost, status) VALUES
('KMSH-S-000001','KMSH-P-000004','KMSH-D-000004','KMSH-DE-000004','OT-1','2026-08-04','10:00','12:30','Laparoscopic Appendectomy',25000,'Scheduled');

-- Laboratory tests
INSERT INTO laboratory_tests (id, patient_id, doctor_id, test_name, date, status) VALUES
('KMSH-L-000001','KMSH-P-000001','KMSH-D-000001','ECG','2026-08-04','Completed'),
('KMSH-L-000002','KMSH-P-000002','KMSH-D-000002','MRI Brain','2026-08-04','Pending'),
('KMSH-L-000003','KMSH-P-000005','KMSH-D-000005','Blood Test','2026-08-04','In Progress');

-- Medicines
INSERT INTO medicines (id, name, category, supplier, batch_number, quantity, price, expiry_date, status) VALUES
('KMSH-M-000001','Paracetamol 500mg','Analgesic','Cipla','B2024-01',1200,5,'2026-08-01','In Stock'),
('KMSH-M-000002','Amoxicillin 250mg','Antibiotic','Sun Pharma','B2024-02',40,18,'2025-12-01','Low Stock'),
('KMSH-M-000003','Atorvastatin 10mg','Statin','Lupin','B2024-03',300,35,'2027-01-01','In Stock'),
('KMSH-M-000004','Metformin 500mg','Antidiabetic','USV','B2023-09',0,12,'2024-10-01','Expired'),
('KMSH-M-000005','Ondansetron 4mg','Anti-emetic','Cipla','B2024-04',220,9,'2026-05-01','In Stock');

-- Billing
INSERT INTO billing (id, patient_id, date, consultation, lab, surgery, pharmacy, room, insurance, discount, gst, total, paid, balance, status) VALUES
('KMSH-B-000001','KMSH-P-000001','2026-08-04',1200,800,0,450,2000,0,100,0,4350,4350,0,'Paid'),
('KMSH-B-000002','KMSH-P-000004','2026-08-04',1800,1500,25000,900,3500,15000,500,0,32200,15000,17200,'Partial');

-- Notifications
INSERT INTO notifications (id, type, title, message, read) VALUES
('KM-N-001','info','Welcome to Kushal Multi Speciality Hospital','Sample demonstration data has been loaded.',0);
