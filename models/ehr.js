const mongoose = require("mongoose");
const ehrScheama = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    symptoms: Array,
    drugs: String,
    disease: {
      type: String,
      required: true,
    },
    formulations: Array,
    sources: Array,
    dosage: Array,
    ingredients: Array,
    pharmacological_properties: Array,
    aleart_and_warnings: Array,
    contradictions: Array,
    meal_planning: Array,
    yoga_remcommandations: Array,
  },
  {
    timestamps: true,
  }
);

const EHR = mongoose.model("EHR", ehrScheama);
module.exports = EHR;
