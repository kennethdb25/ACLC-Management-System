const mongoose = require('mongoose');

const PerformanceSchema = new mongoose.Schema({
  adviser: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  yearSec: {
    type: String,
    required: true
  },
  subjects: {
    type: Array
  },
  created: {
    type: Date
  }
});

const PerformanceModel = new mongoose.model('Performance', PerformanceSchema);

module.exports = PerformanceModel;
