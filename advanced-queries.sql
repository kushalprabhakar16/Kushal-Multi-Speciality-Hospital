-- ============================================================
-- Kushal Multi Speciality Hospital — 20+ Verified Advanced SQL Queries
-- ============================================================
USE kushal_hospital;

-- 1. Patient + Doctor INNER JOIN (patient with assigned doctor)
SELECT p.id AS patient_id, CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
       d.name AS doctor_name, d.specialization
FROM patients p
INNER JOIN doctors d ON p.doctor_id = d.id;

-- 2. Patients grouped by department
SELECT dep.name AS department, COUNT(p.id) AS patient_count
FROM departments dep
LEFT JOIN patients p ON p.department_id = dep.id
GROUP BY dep.id, dep.name
ORDER BY patient_count DESC;

-- 3. Doctors by specialization
SELECT specialization, COUNT(*) AS doctor_count, AVG(consultation_fee) AS avg_fee
FROM doctors
GROUP BY specialization
ORDER BY doctor_count DESC;

-- 4. Appointment statistics by status
SELECT status, COUNT(*) AS total
FROM appointments
GROUP BY status;

-- 5. GROUP BY with aggregate — revenue by department
SELECT dep.name AS department, SUM(b.total) AS total_revenue
FROM billing b
JOIN patients p ON b.patient_id = p.id
JOIN departments dep ON p.department_id = dep.id
GROUP BY dep.id, dep.name;

-- 6. HAVING — departments with more than 2 patients
SELECT dep.name, COUNT(p.id) AS patients
FROM departments dep
JOIN patients p ON p.department_id = dep.id
GROUP BY dep.id, dep.name
HAVING COUNT(p.id) > 2;

-- 7. LEFT JOIN — all doctors and their appointment counts (including zero)
SELECT d.name, COUNT(a.id) AS appointment_count
FROM doctors d
LEFT JOIN appointments a ON a.doctor_id = d.id
GROUP BY d.id, d.name;

-- 8. RIGHT JOIN — all patients and any appointments
SELECT a.id AS appointment_id, p.id AS patient_id, CONCAT(p.first_name,' ',p.last_name) AS patient
FROM appointments a
RIGHT JOIN patients p ON a.patient_id = p.id;

-- 9. Aggregate functions — hospital-wide stats
SELECT
  (SELECT COUNT(*) FROM patients) AS total_patients,
  (SELECT COUNT(*) FROM doctors) AS total_doctors,
  (SELECT COUNT(*) FROM appointments) AS total_appointments,
  (SELECT COALESCE(SUM(total),0) FROM billing) AS total_billing,
  (SELECT COALESCE(SUM(paid),0) FROM billing) AS total_collected;

-- 10. Subquery — patients whose bill total exceeds the average
SELECT b.id, p.id AS patient_id, CONCAT(p.first_name,' ',p.last_name) AS patient, b.total
FROM billing b
JOIN patients p ON b.patient_id = p.id
WHERE b.total > (SELECT AVG(total) FROM billing);

-- 11. Correlated subquery — doctors earning above their department's average fee
SELECT d.name, d.specialization, d.consultation_fee
FROM doctors d
WHERE d.consultation_fee > (
  SELECT AVG(d2.consultation_fee)
  FROM doctors d2
  WHERE d2.department_id = d.department_id
);

-- 12. CTE — top 3 highest-grossing patients
WITH patient_revenue AS (
  SELECT p.id, CONCAT(p.first_name,' ',p.last_name) AS name, SUM(b.total) AS total
  FROM patients p JOIN billing b ON b.patient_id = p.id
  GROUP BY p.id, p.first_name, p.last_name
)
SELECT * FROM patient_revenue
ORDER BY total DESC
LIMIT 3;

-- 13. Window function — running total of collected revenue by date
SELECT id, date, paid,
  SUM(paid) OVER (ORDER BY date, id) AS running_total
FROM billing
ORDER BY date, id;

-- 14. Ranking doctors by number of appointments
SELECT d.name, d.specialization,
  COUNT(a.id) AS appointments,
  RANK() OVER (ORDER BY COUNT(a.id) DESC) AS appt_rank
FROM doctors d
LEFT JOIN appointments a ON a.doctor_id = d.id
GROUP BY d.id, d.name, d.specialization
ORDER BY appt_rank;

-- 15. Patient admission statistics by status
SELECT status, COUNT(*) AS count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM patients), 1) AS percentage
FROM patients
GROUP BY status;

-- 16. Revenue analysis — monthly revenue
SELECT DATE_FORMAT(date, '%Y-%m') AS month,
  COUNT(*) AS invoices, SUM(total) AS billed, SUM(paid) AS collected, SUM(balance) AS outstanding
FROM billing
GROUP BY DATE_FORMAT(date, '%Y-%m')
ORDER BY month;

-- 17. Pharmacy low-stock query
SELECT id, name, category, quantity, price, expiry_date
FROM medicines
WHERE quantity <= 50 AND quantity > 0
ORDER BY quantity ASC;

-- 18. Most frequently used department (by appointments)
SELECT dep.name, COUNT(a.id) AS appointment_count
FROM departments dep
JOIN appointments a ON a.department_id = dep.id
GROUP BY dep.id, dep.name
ORDER BY appointment_count DESC
LIMIT 1;

-- 19. Doctor appointment ranking with DENSE_RANK
SELECT d.name, d.specialization,
  COUNT(a.id) AS total_appointments,
  DENSE_RANK() OVER (ORDER BY COUNT(a.id) DESC) AS rank
FROM doctors d
LEFT JOIN appointments a ON a.doctor_id = d.id
GROUP BY d.id, d.name, d.specialization;

-- 20. Patient visit history (appointments + lab tests via UNION)
SELECT p.id AS patient_id, CONCAT(p.first_name,' ',p.last_name) AS patient,
  'Appointment' AS activity, a.date AS activity_date, a.status
FROM patients p
JOIN appointments a ON a.patient_id = p.id
UNION ALL
SELECT p.id, CONCAT(p.first_name,' ',p.last_name),
  'Lab Test', l.date, l.status
FROM patients p
JOIN laboratory_tests l ON l.patient_id = p.id
ORDER BY patient_id, activity_date;

-- 21. Monthly revenue with LAG (month-over-month growth)
SELECT month, collected,
  LAG(collected) OVER (ORDER BY month) AS prev_month,
  collected - LAG(collected) OVER (ORDER BY month) AS growth
FROM (
  SELECT DATE_FORMAT(date, '%Y-%m') AS month, SUM(paid) AS collected
  FROM billing
  GROUP BY DATE_FORMAT(date, '%Y-%m')
) t
ORDER BY month;

-- 22. Department performance score (patients + appointments + revenue)
SELECT dep.name,
  (SELECT COUNT(*) FROM patients p WHERE p.department_id = dep.id) AS patients,
  (SELECT COUNT(*) FROM appointments a WHERE a.department_id = dep.id) AS appointments,
  (SELECT COALESCE(SUM(b.total),0) FROM billing b JOIN patients p ON b.patient_id = p.id WHERE p.department_id = dep.id) AS revenue,
  ((SELECT COUNT(*) FROM patients p WHERE p.department_id = dep.id) +
   (SELECT COUNT(*) FROM appointments a WHERE a.department_id = dep.id)) AS performance_score
FROM departments dep
ORDER BY performance_score DESC;
