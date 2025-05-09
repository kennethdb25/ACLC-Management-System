const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  studentUserId: {
    type: String
  },
  requestId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  adminRead: {
    type: String
  },
  studentRead: {
    type: String
  },
  created: {
    type: Date,
    required: true
  }
});

const NotificationModel = new mongoose.model('NotificationInfo', NotificationSchema);

module.exports = NotificationModel;
