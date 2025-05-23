const express = require("express");
const ProcessRouter = new express.Router();
const {
  AddPerformance,
  GetPerformanceList,
  updatePerformanceRecord,
  HandleDownloadAgreement,
  getAppointmentsPerStudent,
  getAllAppointments,
  addAnAppointment,
  updateAppointmentStatus,
  addViolation,
  getAllViolation,
  updateViolationStatus,
  getUnreadNotificationForAdmin,
  getUnreadNotificationFOrStudent,
  updateNotification,
  getViolationData,
} = require("../controllers/Process.controller");
const multer = require("multer");

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

// File filter to allow only PDF, DOC, DOCX
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF, DOC, and DOCX are allowed."));
  }
};

const upload = multer({ storage, fileFilter });
// ADD REQUEST FORM //
ProcessRouter.post("/api/performance", AddPerformance);

// GET ALL REQUEST FORM //
ProcessRouter.get("/api/performance/all", GetPerformanceList);

// UPDATE REQUEST FORM STATUS //
ProcessRouter.put("/api/performance/:requestId", updatePerformanceRecord);

// DOWNLOAD AGREEMENT //
ProcessRouter.get(
  "/api/performance/download-agreement",
  HandleDownloadAgreement
);

// GET APPOINTMENT PER STUDENT
ProcessRouter.get("/api/appointments/student", getAppointmentsPerStudent);

// GET ALL APPOINTMENTS //
ProcessRouter.get("/api/appointments", getAllAppointments);

// SET AN APPOINTMENTS //
ProcessRouter.post("/api/appointments", addAnAppointment);

// UPDATE REQUEST FORM STATUS //
ProcessRouter.patch(
  "/api/appointments/status/:requestId",
  updateAppointmentStatus
);

// ADD VIOLATION //
ProcessRouter.post("/api/violation", upload.single("file"), addViolation);

// GET ALL VIOLATIONS //
ProcessRouter.get("/api/violation", getAllViolation);

// UPDATE REQUEST FORM STATUS //
ProcessRouter.patch(
  "/api/violation/status/:violationId",
  updateViolationStatus
);

// GET VIOLATION FOR DASHBOARD DATA
ProcessRouter.get("/api/violation/data", getViolationData);

// GET NOTIFICATION FOR ADMIN
ProcessRouter.get(
  "/api/push-admin-notification/admin",
  getUnreadNotificationForAdmin
);

// GET NOTIFICATION FOR STUDENT
ProcessRouter.get(
  "/api/push-notification/:studentUserId",
  getUnreadNotificationFOrStudent
);

// PATCH NOTIFICATION ALREADY READ
ProcessRouter.patch(
  "/api/push-notification/update-read/:notificationId",
  updateNotification
);

module.exports = ProcessRouter;
