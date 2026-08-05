import { PatientModel } from "../models/Patient.js";
import { DoctorModel } from "../models/Doctor.js";
import {
  AppointmentModel, DepartmentModel, OperationModel, LabTestModel,
  MedicineModel, BillModel, StaffModel, NotificationModel,
} from "../models/index.js";

function makeController(Model, label) {
  return {
    list: async (_req, res, next) => {
      try { res.json(await Model.findAll()); } catch (e) { next(e); }
    },
    getOne: async (req, res, next) => {
      try {
        const row = await Model.findById(req.params.id);
        if (!row) return res.status(404).json({ message: label + " not found" });
        res.json(row);
      } catch (e) { next(e); }
    },
    create: async (req, res, next) => {
      try { await Model.create(req.body); res.status(201).json(req.body); } catch (e) { next(e); }
    },
    update: async (req, res, next) => {
      try { await Model.update(req.params.id, req.body); res.json({ success: true }); } catch (e) { next(e); }
    },
    remove: async (req, res, next) => {
      try { await Model.remove(req.params.id); res.json({ success: true }); } catch (e) { next(e); }
    },
  };
}

export const patientCtrl = makeController(PatientModel, "Patient");
export const doctorCtrl = makeController(DoctorModel, "Doctor");
export const appointmentCtrl = makeController(AppointmentModel, "Appointment");
export const departmentCtrl = makeController(DepartmentModel, "Department");
export const operationCtrl = makeController(OperationModel, "Operation");
export const labCtrl = makeController(LabTestModel, "Lab test");
export const pharmacyCtrl = makeController(MedicineModel, "Medicine");
export const billCtrl = makeController(BillModel, "Bill");
export const staffCtrl = makeController(StaffModel, "Staff member");
export const notificationCtrl = {
  list: async (_req, res, next) => { try { res.json(await NotificationModel.findAll()); } catch (e) { next(e); } },
  markRead: async (req, res, next) => { try { await NotificationModel.markRead(req.params.id); res.json({ success: true }); } catch (e) { next(e); } },
  markAllRead: async (_req, res, next) => { try { await NotificationModel.markAllRead(); res.json({ success: true }); } catch (e) { next(e); } },
};
