const { PromisePool } = require("@supercharge/promise-pool");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const AccountModel = require("../models/AccountModel");
const ReportModel = require("../models/ReportModel");
const path = require("path");
const AppointmentModel = require("../models/AppointmentModel");
const LoginHistoryModel = require("../models/LoginHistoryModel");
const ViolationModel = require("../models/ViolationModel");
const PerformanceModel = require("../models/PerformanceModel");

const AddReport = async (req, res) => {
  const { report, start, end } = req.body;
  let fileName = `${report.toUpperCase()}-${new Date().getTime()}-generated-report.csv`;
  let pathFile = path.resolve(__dirname, "../file-uploads");
  var date = new Date(start);
  date.setDate(date.getDate() - 1);
  const splitStart = date.toISOString().split("T");

  const startDate = new Date(`${splitStart[0]}T16:00:00.000+00:00`);
  const endDate = new Date(`${end}T16:00:00.000+00:00`);
  let dataReport;
  let csvWriter;

  switch (report) {
    case "accountInformation":
      dataReport = await AccountModel.find({
        created: {
          $gte: startDate,
          $lte: endDate,
        },
      });

      csvWriter = createCsvWriter({
        header: [
          { id: "identification", title: "ID Number" },
          { id: "firstName", title: "First Name" },
          { id: "middleName", title: "Middle Name" },
          { id: "lastName", title: "Last Name" },
          { id: "userType", title: "User Type" },
          { id: "address", title: "Address" },
          { id: "contact", title: "Contact Number" },
          { id: "gender", title: "Gender" },
          { id: "email", title: "Email" },
          { id: "acctStatus", title: "Created" },
          { id: "created", title: "Created" },
        ],
        path: `${pathFile}/${fileName}`,
      });
      break;
    case "appointment":
      dataReport = await AppointmentModel.find({
        created: {
          $gte: startDate,
          $lte: endDate,
        },
      });

      csvWriter = createCsvWriter({
        header: [
          { id: "identification", title: "Student ID" },
          { id: "name", title: "Requestor Name" },
          { id: "email", title: "Email" },
          { id: "contact", title: "Contact Number" },
          { id: "appointmentStatus", title: "Appointment Status" },
          { id: "time", title: "Time" },
          { id: "date", title: "Date" },
        ],
        path: `${pathFile}/${fileName}`,
      });
      break;
    case "loginHistory":
      dataReport = await LoginHistoryModel.find({
        created: {
          $gte: startDate,
          $lte: endDate,
        },
      });

      csvWriter = createCsvWriter({
        header: [
          { id: "userId", title: "User ID" },
          { id: "firstName", title: "First Name" },
          { id: "middleName", title: "Middle Name" },
          { id: "lastName", title: "Last Name" },
          { id: "userType", title: "User Type" },
          { id: "email", title: "Email" },
          { id: "loginDate", title: "Login Date" },
        ],
        path: `${pathFile}/${fileName}`,
      });
      break;
    case "violation":
      dataReport = await ViolationModel.find({
        created: {
          $gte: startDate,
          $lte: endDate,
        },
      });

      csvWriter = createCsvWriter({
        header: [
          { id: "identification", title: "ID Number" },
          { id: "firstName", title: "First Name" },
          { id: "middleName", title: "Middle Name" },
          { id: "lastName", title: "Last Name" },
          { id: "userType", title: "User Type" },
          { id: "address", title: "Address" },
          { id: "contact", title: "Contact Number" },
          { id: "gender", title: "Gender" },
          { id: "email", title: "Email" },
          { id: "acctStatus", title: "Created" },
          { id: "created", title: "Created" },
        ],
        path: `${pathFile}/${fileName}`,
      });
      break;
  }
  const { results } = await PromisePool.withConcurrency(300)
    .for(dataReport)
    .process((details) => {
      switch (report) {
        case "accountInformation":
          return {
            identification: details.identification,
            firstName: details.firstName,
            middleName: details.middleName,
            lastName: details.lastName,
            userType: details.userType,
            address: details.address,
            contact: details.contact,
            gender: details.gender,
            email: details.email,
            acctStatus: details.acctStatus,
            created: new Date(details.created),
          };
        case "appointment":
          return {
            identification: details.studentId,
            name: details.requestorName,
            email: details.email,
            contact: details.contact,
            appointmentStatus: details.appointmentStatus,
            time: details.time,
            date: details.date,
          };
        case "loginHistory":
          return {
            userId: details.userId,
            firstName: details.firstName,
            middleName: details.middleName,
            lastName: details.lastName,
            userType: details.userType,
            email: details.email,
            loginDate: new Date(details.created),
          };
      }
    });
  await csvWriter.writeRecords(results);
  try {
    const finalRecord = new ReportModel({
      filePath: fileName,
      created: new Date().toISOString(),
    });
    const storeData = await finalRecord.save();
    return res.status(201).json({ status: 201, body: storeData });
  } catch (error) {
    return res.status(422).json(error);
  }
};

const GetAllReport = async (req, res) => {
  try {
    const generatedReport = await ReportModel.find().sort({ created: -1 });
    return res.status(200).json({ status: 200, body: generatedReport });
  } catch (error) {
    return res.status(422).json(error);
  }
};

const DownloadReport = async (req, res) => {
  const file = req.query.filename || "";
  const pathFile = path.join(__dirname, `../file-uploads/${file}`);

  res.download(pathFile, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "An error occured" });
    }
  });
};

const GetDashboardCardCount = async (req, res) => {
  try {
    const getAllApprovedRequestForm = await PerformanceModel.find({
      requestStatus: "APPROVED",
    });

    const getAllRequestForm = await PerformanceModel.find({});

    const getAllAppointments = await AppointmentModel.find({});

    const getAllStudentAccount = await AccountModel.find({
      userType: "STUDENT",
    });

    const getAllViolation = await ViolationModel.find({});
    console.log();
    return res.status(200).json({
      status: 200,
      body: {
        approveRequest: getAllApprovedRequestForm.length,
        request: getAllRequestForm.length,
        appointment: getAllAppointments.length,
        student: getAllStudentAccount.length,
        violation: getAllViolation.length,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
};

const GetDashboardCardCountPerStudent = async (req, res) => {
  const id = req.query.studentId || "";
  try {
    const data = await AppointmentModel.aggregate([
      {
        $match: {
          studentId: id,
        },
      },
      {
        $group: {
          _id: "$appointmentStatus",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const allStatuses = {
      Approved: 0,
      Pending: 0,
      Rejected: 0,
      Rescheduled: 0,
    };

    data.forEach(({ _id, count }) => {
      const key = _id.trim().toLowerCase();
      if (key === "approved") allStatuses.Approved = count;
      if (key === "pending") allStatuses.Pending = count;
      if (key === "rejected") allStatuses.Rejected = count;
      if (key === "reschedule" || key === "rescheduled")
        allStatuses.Rescheduled = count;
    });

    // Convert to desired format for chart
    const formatted = Object.entries(allStatuses).map(([name, value]) => ({
      name,
      value,
    }));
    return res.status(201).json({ status: 201, body: formatted });
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
};

const getUpcomingStudentAppointment = async (req, res) => {
  const id = req.query.studentId || "";
  try {
    let upcomingData = [];
    const today = new Date();
    const rangeDate = new Date(today);
    rangeDate.setFullYear(today.getFullYear() + 1);

    const getAppointments = await AppointmentModel.find({
      studentId: id,
      appointmentStatus: "APPROVED",
      created: { $gte: today, $lte: rangeDate },
    })
      .sort({ created: 1 })
      .limit(8);

    getAppointments.map((data) => {
      upcomingData.push({
        txId: data.studentId,
        user: data.requestorName,
        date: data.date,
        cost: "ACCEPTED",
      });
    });

    return res.status(201).json({ status: 201, body: upcomingData });
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
};

const getUpcomingAppointment = async (req, res) => {
  try {
    let upcomingData = [];
    const today = new Date();
    const rangeDate = new Date(today);
    rangeDate.setFullYear(today.getFullYear() + 1);

    const getAppointments = await AppointmentModel.find({
      appointmentStatus: "APPROVED",
      created: { $gte: today, $lte: rangeDate },
    })
      .sort({ created: 1 })
      .limit(8);

    getAppointments.map((data) => {
      upcomingData.push({
        txId: data.studentId,
        user: data.requestorName,
        date: data.date,
        cost: "ACCEPTED",
      });
    });

    return res.status(201).json({ status: 201, body: upcomingData });
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
};

module.exports = {
  AddReport,
  GetAllReport,
  DownloadReport,
  GetDashboardCardCount,
  GetDashboardCardCountPerStudent,
  getUpcomingStudentAppointment,
  getUpcomingAppointment,
};
