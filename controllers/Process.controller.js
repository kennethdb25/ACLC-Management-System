const AppointmentModel = require("../models/AppointmentModel");
const NotificationModel = require("../models/NotificationModel");
const PerformanceModel = require("../models/PerformanceModel");
const ViolationModel = require("../models/ViolationModel");

const AddPerformance = async (req, res) => {
  try {
    let perfomarnceLists = req.body;
    perfomarnceLists.status = "Added";
    perfomarnceLists.created = new Date();

    const finalRecord = await PerformanceModel.insertMany(perfomarnceLists);

    const notificationDetails = new NotificationModel({
      requestId: finalRecord[0]?._id,
      title: "Peformance Monitoring",
      description: "You have a Newly Added for Monitoring",
      type: "Form",
      adminRead: "No",
      created: new Date(),
    });

    await notificationDetails.save();
    return res.status(200).json({ status: 200, body: finalRecord });
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({
        status: 422,
        body: "Something went wrong. Please contact the administrator",
      });
  }
};

const GetPerformanceList = async (req, res) => {
  try {
    const allPerformance = await PerformanceModel.find();
    return res.status(200).json({ status: 200, body: allPerformance });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

const updatePerformanceRecord = async (req, res) => {
  try {
    const updated = await PerformanceModel.findByIdAndUpdate(
      req.params.requestId,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res
        .status(401)
        .json({
          body: "Something went wrong. Please contact your Administrator!",
        });
    }

    return res.status(200).json({ status: 200, body: updated });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

const getAppointmentsPerStudent = async (req, res) => {
  const email = req.query.email || "";

  try {
    const getAppointmentPerStudent = await AppointmentModel.find({ email });
    return res
      .status(200)
      .json({ status: 200, body: getAppointmentPerStudent });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const allAppointments = await AppointmentModel.find();
    return res.status(200).json({ status: 200, body: allAppointments });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

const addAnAppointment = async (req, res) => {
  try {
    const {
      contact,
      date,
      email,
      requestorName,
      purpose,
      studentId,
      time,
      userId,
    } = req.body;

    const appointmentDetails = new AppointmentModel({
      contact,
      date,
      email,
      requestorName,
      studentId,
      time,
      userId,
      purpose,
      appointmentStatus: "PENDING",
      created: new Date(),
    });

    const data = await appointmentDetails.save();

    const notificationDetails = new NotificationModel({
      studentUserId: userId,
      requestId: data?._id,
      title: "New Appointment Scheduled",
      description: "You have a new appointment request",
      type: "Appointment",
      adminRead: "No",
      created: new Date(),
    });

    await notificationDetails.save();
    return res.status(200).json({ status: 200, body: data });
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({
        status: 422,
        body: "Something went wrong. Please contact the administrator",
      });
  }
};

const updateAppointmentStatus = async (req, res) => {
  const id = req.params.requestId || "";
  const { requestStatus, notes } = req.body;
  try {
    const getRequestForm = await AppointmentModel.findOne({ _id: id });

    if (!getRequestForm) {
      return res
        .status(401)
        .json({
          body: "Something went wrong. Please contact your Administrator!",
        });
    }

    getRequestForm.appointmentStatus = requestStatus;
    getRequestForm.notes = notes;

    const changeSuccess = await getRequestForm.save();

    return res.status(200).json({ status: 200, body: changeSuccess });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

const addViolation = async (req, res) => {
  try {
    const {
      address,
      contact,
      firstName,
      gender,
      lastName,
      middleName,
      sanction,
      studentId,
      violation,
      violationDate,
    } = req.body;

    const violationDetails = new ViolationModel({
      address,
      contact,
      firstName,
      gender,
      lastName,
      middleName,
      sanction,
      studentId,
      violation,
      violationDate,
      violationStatus: "IN PROGRESS",
      created: new Date(),
    });

    const data = await violationDetails.save();
    return res.status(200).json({ status: 200, body: data });
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({
        status: 422,
        body: "Something went wrong. Please contact the administrator",
      });
  }
};

const getAllViolation = async (req, res) => {
  try {
    const allViolations = await ViolationModel.find();
    return res.status(200).json({ status: 200, body: allViolations });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

const updateViolationStatus = async (req, res) => {
  const id = req.params.violationId || "";
  const { requestStatus, notes } = req.body;
  try {
    const getViolation = await ViolationModel.findOne({ _id: id });

    if (!getViolation) {
      return res
        .status(401)
        .json({
          body: "Something went wrong. Please contact your Administrator!",
        });
    }

    getViolation.violationStatus = requestStatus;
    getViolation.notes = notes;

    const changeSuccess = await getViolation.save();

    return res.status(200).json({ status: 200, body: changeSuccess });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

const getViolationData = async (req, res) => {
  let finalData = [];
  try {
    const fields = await ViolationModel.find().distinct("violation");
    fields.map(async (field) => {
      const data = await ViolationModel.find({
        gender: "Male",
        violation: field,
      }).then((result) => {
        finalData.push({ x: field, y: result.length });
        // console.log(result);
      });
    });
  } catch (error) {}
};

const getUnreadNotificationForAdmin = async (req, res) => {
  try {
    const getNotificationForAdmin = await NotificationModel.find({
      adminRead: "No",
    }).sort({ created: -1 });
    return res.status(200).json({ status: 200, body: getNotificationForAdmin });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

const getUnreadNotificationFOrStudent = async (req, res) => {
  const id = req.params.studentUserId || "";

  try {
    const getNotificationForStudent = await NotificationModel.find({
      studentRead: "No",
      studentUserId: id.toString(),
    }).sort({ created: -1 });
    return res
      .status(200)
      .json({ status: 200, body: getNotificationForStudent });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

const updateNotification = async (req, res) => {
  const id = req.params.notificationId || "";

  try {
    const getNotification = await NotificationModel.findOne({ _id: id });
    if (!getNotification) {
      return res
        .status(500)
        .json({
          body: "Something went wrong. Please contact your Administrator!",
        });
    }
    getNotification.adminRead = "Yes";

    const changeSuccess = await getNotification.save();

    return res.status(200).json({ status: 201, body: changeSuccess });
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};

module.exports = {
  AddPerformance,
  GetPerformanceList,
  updatePerformanceRecord,
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
};
