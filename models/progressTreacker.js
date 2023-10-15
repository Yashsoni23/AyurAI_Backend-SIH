const mongoose = require("mongoose");
const progressTrackerScheama = new mongoose.Schema(
  {
    progressRate: {
      type: Number,
      required: true,
      default: 10,
    },
    progressComment: {
      type: String,
      required: true,
      default: "",
    },
    Disease: {
      type: String,
      required: true,
      default: "",
    },
    userId: {
      type: String,
      required: true,
      default: "",
    },
    EHR_ID: {
      type: String,
      required: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const ProgressTracker = mongoose.model(
  "ProgressTracker",
  progressTrackerScheama
);
module.exports = ProgressTracker;
