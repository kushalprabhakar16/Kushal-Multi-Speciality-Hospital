import { Router } from "express";
import { patientCtrl, doctorCtrl, appointmentCtrl, departmentCtrl, operationCtrl, labCtrl, pharmacyCtrl, billCtrl, staffCtrl, notificationCtrl } from "../controllers/crudController.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";

function crud(model, label, opts = {}) {
  const r = Router();
  r.get("/", authMiddleware, model.list);
  r.get("/:id", authMiddleware, model.getOne);
  if (opts.writeOnly !== false) {
    r.post("/", authMiddleware, requireRole("Administrator", "Receptionist", "Doctor"), model.create);
    r.put("/:id", authMiddleware, requireRole("Administrator", "Receptionist", "Doctor"), model.update);
    r.delete("/:id", authMiddleware, requireRole("Administrator"), model.remove);
  }
  return r;
}

export function apiRoutes() {
  const r = Router();

  r.use("/patients", crud(patientCtrl, "Patient"));
  r.use("/doctors", crud(doctorCtrl, "Doctor"));
  r.use("/appointments", crud(appointmentCtrl, "Appointment"));
  r.use("/departments", crud(departmentCtrl, "Department"));
  r.use("/operations", crud(operationCtrl, "Operation"));
  r.use("/lab-tests", crud(labCtrl, "Lab test"));
  r.use("/pharmacy", crud(pharmacyCtrl, "Medicine"));
  r.use("/billing", crud(billCtrl, "Bill"));
  r.use("/staff", crud(staffCtrl, "Staff member"));

  r.get("/notifications", authMiddleware, notificationCtrl.list);
  r.put("/notifications/:id/read", authMiddleware, notificationCtrl.markRead);
  r.put("/notifications/read-all", authMiddleware, notificationCtrl.markAllRead);

  return r;
}
