const express = require('express');
const ProcessRouter = new express.Router();
const { AddPerformance, GetPerformanceList, updatePerformanceRecord, getAppointmentsPerStudent, getAllAppointments, addAnAppointment, updateAppointmentStatus, addViolation, getAllViolation, updateViolationStatus, getUnreadNotificationForAdmin, getUnreadNotificationFOrStudent, updateNotification, getViolationData } = require('../controllers/Process.controller');

// ADD REQUEST FORM //
ProcessRouter.post('/api/performance', AddPerformance);

// GET ALL REQUEST FORM //
ProcessRouter.get('/api/performance/all', GetPerformanceList);

// UPDATE REQUEST FORM STATUS //
ProcessRouter.put('/api/performance/:requestId', updatePerformanceRecord);

// GET APPOINTMENT PER STUDENT
ProcessRouter.get('/api/appointments/student', getAppointmentsPerStudent);

// GET ALL APPOINTMENTS //
ProcessRouter.get('/api/appointments', getAllAppointments);

// SET AN APPOINTMENTS //
ProcessRouter.post('/api/appointments', addAnAppointment);

// UPDATE REQUEST FORM STATUS //
ProcessRouter.patch('/api/appointments/status/:requestId', updateAppointmentStatus);

// ADD VIOLATION //
ProcessRouter.post('/api/violation', addViolation);

// GET ALL VIOLATIONS //
ProcessRouter.get('/api/violation', getAllViolation);

// UPDATE REQUEST FORM STATUS //
ProcessRouter.patch('/api/violation/status/:violationId', updateViolationStatus);

// GET VIOLATION FOR DASHBOARD DATA
ProcessRouter.get('/api/violation/data', getViolationData);

// GET NOTIFICATION FOR ADMIN
ProcessRouter.get('/api/push-admin-notification/admin', getUnreadNotificationForAdmin);

// GET NOTIFICATION FOR STUDENT
ProcessRouter.get('/api/push-notification/:studentUserId', getUnreadNotificationFOrStudent);

// PATCH NOTIFICATION ALREADY READ
ProcessRouter.patch('/api/push-notification/update-read/:notificationId', updateNotification);

module.exports = ProcessRouter;
