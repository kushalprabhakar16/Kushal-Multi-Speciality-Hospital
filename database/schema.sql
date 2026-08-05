-- ============================================================
-- Kushal Multi Speciality Hospital — Database Schema
-- MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS kushal_hospital
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kushal_hospital;

-- Drop in dependency-safe order
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS patient_documents;
DROP TABLE IF EXISTS doctor_documents;
DROP TABLE IF EXISTS billing_items;
DROP TABLE IF EXISTS billing;
DROP TABLE IF EXISTS pharmacy_transactions;
DROP TABLE IF EXISTS medicines;
DROP TABLE IF EXISTS laboratory_reports;
DROP TABLE IF EXISTS laboratory_tests;
DROP TABLE IF EXISTS operation_doctors;
DROP TABLE IF EXISTS operations;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS doctors;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS users;

-- --------------------------------------------------------
-- Users (auth)
-- --------------------------------------------------------
CREATE TABLE users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  email       VARCHAR(160) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  role        ENUM('Administrator','Doctor','Receptionist','Nurse','Lab Technician','Pharmacist','Patient') NOT NULL DEFAULT 'Patient',
  status      ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email)
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Departments
-- --------------------------------------------------------
CREATE TABLE departments (
  id          VARCHAR(20) PRIMARY KEY,
  name        VARCHAR(100) NOT NULL UNIQUE,
  head        VARCHAR(120),
  phone       VARCHAR(20),
  location    VARCHAR(120),
  status      ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_departments_name (name)
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Doctors
-- --------------------------------------------------------
CREATE TABLE doctors (
  id                VARCHAR(20) PRIMARY KEY,
  name              VARCHAR(120) NOT NULL,
  gender            ENUM('Male','Female','Other'),
  dob               DATE,
  qualification     VARCHAR(160),
  specialization    VARCHAR(120),
  department_id     VARCHAR(20),
  experience        INT,
  license_number    VARCHAR(60),
  phone             VARCHAR(20),
  email             VARCHAR(160),
  address           VARCHAR(255),
  room              VARCHAR(40),
  consultation_fee  DECIMAL(10,2) DEFAULT 0,
  available_days    VARCHAR(60),
  available_time    VARCHAR(60),
  languages         VARCHAR(160),
  bio               TEXT,
  certifications    TEXT,
  awards            TEXT,
  status           ENUM('Available','On Leave') DEFAULT 'Available',
  photo            VARCHAR(255),
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_doctors_dept FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  INDEX idx_doctors_spec (specialization),
  INDEX idx_doctors_dept (department_id)
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Patients
-- --------------------------------------------------------
CREATE TABLE patients (
  id                  VARCHAR(20) PRIMARY KEY,
  first_name          VARCHAR(80) NOT NULL,
  last_name           VARCHAR(80) NOT NULL,
  gender              ENUM('Male','Female','Other'),
  dob                 DATE,
  blood_group         VARCHAR(5),
  height              DECIMAL(5,2),
  weight              DECIMAL(5,2),
  phone               VARCHAR(20) NOT NULL,
  email               VARCHAR(160),
  address             VARCHAR(255),
  city                VARCHAR(80),
  emergency_name      VARCHAR(120),
  emergency_number    VARCHAR(20),
  emergency_relation  VARCHAR(60),
  disease             VARCHAR(160),
  diagnosis           TEXT,
  allergies           TEXT,
  medical_history     TEXT,
  current_medications TEXT,
  insurance_provider  VARCHAR(120),
  insurance_number    VARCHAR(60),
  doctor_id           VARCHAR(20),
  department_id       VARCHAR(20),
  ward                VARCHAR(60),
  bed                 VARCHAR(40),
  admission_date      DATE,
  discharge_date      DATE,
  status              ENUM('Admitted','Discharged','Emergency','Pending') DEFAULT 'Pending',
  notes               TEXT,
  photo               VARCHAR(255),
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_patients_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL,
  CONSTRAINT fk_patients_dept FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  INDEX idx_patients_name (last_name, first_name),
  INDEX idx_patients_status (status),
  INDEX idx_patients_dept (department_id)
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Staff
-- --------------------------------------------------------
CREATE TABLE staff (
  id            VARCHAR(20) PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  role          ENUM('Administrator','Receptionist','Nurse','Lab Technician','Pharmacist','Accountant','Support Staff') NOT NULL,
  department_id VARCHAR(20),
  phone         VARCHAR(20),
  email         VARCHAR(160),
  joining_date  DATE,
  status        ENUM('Active','Inactive') DEFAULT 'Active',
  photo         VARCHAR(255),
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_staff_dept FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  INDEX idx_staff_role (role)
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Appointments
-- --------------------------------------------------------
CREATE TABLE appointments (
  id            VARCHAR(20) PRIMARY KEY,
  patient_id    VARCHAR(20) NOT NULL,
  doctor_id     VARCHAR(20) NOT NULL,
  department_id VARCHAR(20),
  date          DATE NOT NULL,
  time          TIME,
  reason        VARCHAR(255),
  status        ENUM('Pending','Completed','Cancelled') DEFAULT 'Pending',
  notes         TEXT,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_appt_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  CONSTRAINT fk_appt_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  CONSTRAINT fk_appt_dept FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  INDEX idx_appt_date (date),
  INDEX idx_appt_doctor (doctor_id)
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Operations / Surgeries
-- --------------------------------------------------------
CREATE TABLE operations (
  id              VARCHAR(20) PRIMARY KEY,
  patient_id      VARCHAR(20) NOT NULL,
  lead_doctor_id  VARCHAR(20) NOT NULL,
  department_id   VARCHAR(20),
  theatre         VARCHAR(40),
  date            DATE NOT NULL,
  start_time      TIME,
  end_time        TIME,
  type            VARCHAR(160),
  cost            DECIMAL(12,2) DEFAULT 0,
  status          ENUM('Scheduled','In Progress','Completed','Cancelled') DEFAULT 'Scheduled',
  notes           TEXT,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_op_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  CONSTRAINT fk_op_doctor FOREIGN KEY (lead_doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  CONSTRAINT fk_op_dept FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  INDEX idx_op_date (date)
) ENGINE=InnoDB;

-- Supporting doctors for an operation (many-to-many)
CREATE TABLE operation_doctors (
  operation_id  VARCHAR(20) NOT NULL,
  doctor_id     VARCHAR(20) NOT NULL,
  role          VARCHAR(60),
  PRIMARY KEY (operation_id, doctor_id),
  CONSTRAINT fk_opdoc_op FOREIGN KEY (operation_id) REFERENCES operations(id) ON DELETE CASCADE,
  CONSTRAINT fk_opdoc_doc FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Laboratory
-- --------------------------------------------------------
CREATE TABLE laboratory_tests (
  id          VARCHAR(20) PRIMARY KEY,
  patient_id  VARCHAR(20) NOT NULL,
  doctor_id   VARCHAR(20),
  test_name   VARCHAR(120) NOT NULL,
  date        DATE NOT NULL,
  status      ENUM('Pending','In Progress','Completed') DEFAULT 'Pending',
  report_url  VARCHAR(255),
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_lab_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  CONSTRAINT fk_lab_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL,
  INDEX idx_lab_patient (patient_id)
) ENGINE=InnoDB;

CREATE TABLE laboratory_reports (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  test_id       VARCHAR(20) NOT NULL,
  result        TEXT,
  report_url    VARCHAR(255),
  uploaded_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_labrep_test FOREIGN KEY (test_id) REFERENCES laboratory_tests(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Pharmacy
-- --------------------------------------------------------
CREATE TABLE medicines (
  id            VARCHAR(20) PRIMARY KEY,
  name          VARCHAR(160) NOT NULL,
  category      VARCHAR(80),
  supplier      VARCHAR(120),
  batch_number  VARCHAR(60),
  quantity      INT NOT NULL DEFAULT 0,
  price         DECIMAL(10,2) NOT NULL DEFAULT 0,
  expiry_date   DATE,
  status        ENUM('In Stock','Low Stock','Out of Stock','Expired') DEFAULT 'In Stock',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_meds_name (name),
  INDEX idx_meds_expiry (expiry_date)
) ENGINE=InnoDB;

CREATE TABLE pharmacy_transactions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  medicine_id   VARCHAR(20) NOT NULL,
  patient_id    VARCHAR(20),
  type          ENUM('Purchase','Sale') NOT NULL,
  quantity      INT NOT NULL,
  amount        DECIMAL(12,2),
  transaction_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pharm_med FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
  CONSTRAINT fk_pharm_pat FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Billing
-- --------------------------------------------------------
CREATE TABLE billing (
  id            VARCHAR(20) PRIMARY KEY,
  patient_id    VARCHAR(20) NOT NULL,
  date          DATE NOT NULL,
  consultation  DECIMAL(10,2) DEFAULT 0,
  lab           DECIMAL(10,2) DEFAULT 0,
  surgery       DECIMAL(10,2) DEFAULT 0,
  pharmacy      DECIMAL(10,2) DEFAULT 0,
  room          DECIMAL(10,2) DEFAULT 0,
  insurance     DECIMAL(10,2) DEFAULT 0,
  discount      DECIMAL(10,2) DEFAULT 0,
  gst           DECIMAL(10,2) DEFAULT 0,
  total         DECIMAL(12,2) DEFAULT 0,
  paid          DECIMAL(12,2) DEFAULT 0,
  balance       DECIMAL(12,2) DEFAULT 0,
  status        ENUM('Paid','Unpaid','Partial') DEFAULT 'Unpaid',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_bill_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  INDEX idx_bill_date (date)
) ENGINE=InnoDB;

CREATE TABLE billing_items (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  bill_id     VARCHAR(20) NOT NULL,
  description VARCHAR(160),
  amount      DECIMAL(10,2),
  CONSTRAINT fk_billitem_bill FOREIGN KEY (bill_id) REFERENCES billing(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Documents
-- --------------------------------------------------------
CREATE TABLE patient_documents (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  patient_id  VARCHAR(20) NOT NULL,
  name        VARCHAR(160),
  type        VARCHAR(60),
  file_url    VARCHAR(255),
  uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pdoc_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE doctor_documents (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  doctor_id   VARCHAR(20) NOT NULL,
  name        VARCHAR(160),
  type        VARCHAR(60),
  file_url    VARCHAR(255),
  uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ddoc_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Notifications & Audit
-- --------------------------------------------------------
CREATE TABLE notifications (
  id          VARCHAR(40) PRIMARY KEY,
  type        VARCHAR(40),
  title       VARCHAR(160),
  message     TEXT,
  read        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_notif_read (read)
) ENGINE=InnoDB;

CREATE TABLE audit_logs (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  table_name  VARCHAR(60) NOT NULL,
  row_id      VARCHAR(40),
  action      ENUM('INSERT','UPDATE','DELETE') NOT NULL,
  changed_by  VARCHAR(120),
  changed_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  old_data    JSON,
  new_data    JSON
) ENGINE=InnoDB;
