-- ============================================================
-- Kushal Multi Speciality Hospital — Triggers
-- ============================================================
USE kushal_hospital;

DELIMITER $$

-- Patient audit: log INSERT
CREATE TRIGGER trg_patient_insert
AFTER INSERT ON patients
FOR EACH ROW
BEGIN
  INSERT INTO audit_logs (table_name, row_id, action, new_data)
  VALUES ('patients', NEW.id, 'INSERT', JSON_OBJECT('id', NEW.id, 'name', CONCAT(NEW.first_name,' ',NEW.last_name), 'status', NEW.status));
END$$

-- Patient audit: log UPDATE
CREATE TRIGGER trg_patient_update
AFTER UPDATE ON patients
FOR EACH ROW
BEGIN
  INSERT INTO audit_logs (table_name, row_id, action, old_data, new_data)
  VALUES ('patients', NEW.id, 'UPDATE',
    JSON_OBJECT('status', OLD.status, 'doctor_id', OLD.doctor_id),
    JSON_OBJECT('status', NEW.status, 'doctor_id', NEW.doctor_id));
END$$

-- Doctor audit: log INSERT
CREATE TRIGGER trg_doctor_insert
AFTER INSERT ON doctors
FOR EACH ROW
BEGIN
  INSERT INTO audit_logs (table_name, row_id, action, new_data)
  VALUES ('doctors', NEW.id, 'INSERT', JSON_OBJECT('id', NEW.id, 'name', NEW.name, 'specialization', NEW.specialization));
END$$

-- Billing audit: log INSERT
CREATE TRIGGER trg_billing_insert
AFTER INSERT ON billing
FOR EACH ROW
BEGIN
  INSERT INTO audit_logs (table_name, row_id, action, new_data)
  VALUES ('billing', NEW.id, 'INSERT', JSON_OBJECT('id', NEW.id, 'total', NEW.total, 'status', NEW.status));
END$$

-- Pharmacy stock update: auto-set status based on quantity
CREATE TRIGGER trg_medicine_update_status
BEFORE UPDATE ON medicines
FOR EACH ROW
BEGIN
  IF NEW.expiry_date < CURDATE() THEN
    SET NEW.status = 'Expired';
  ELSEIF NEW.quantity = 0 THEN
    SET NEW.status = 'Out of Stock';
  ELSEIF NEW.quantity <= 50 THEN
    SET NEW.status = 'Low Stock';
  ELSE
    SET NEW.status = 'In Stock';
  END IF;
END$$

-- Pharmacy stock update on sale: decrement quantity
CREATE TRIGGER trg_pharm_sale_decrement
AFTER INSERT ON pharmacy_transactions
FOR EACH ROW
BEGIN
  IF NEW.type = 'Sale' THEN
    UPDATE medicines SET quantity = quantity - NEW.quantity WHERE id = NEW.medicine_id;
  ELSEIF NEW.type = 'Purchase' THEN
    UPDATE medicines SET quantity = quantity + NEW.quantity WHERE id = NEW.medicine_id;
  END IF;
END$$

DELIMITER ;
