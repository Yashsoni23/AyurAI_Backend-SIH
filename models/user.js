const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "", // Default value for name
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    userType: {
      type: String,
      default: "", // Default value for userType
    },
    isVerified: {
      type: Boolean,
      default: false, // Default value for isVerified
    },
    age: {
      type: Number,
      default: 0, // Default value for age
    },
    PHR: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EHR", // Reference to the EHR model
      },
    ],
    bad_habits: {
      type: Array,
      default: [], // Default value for bad_habits
    },
    BMI: {
      type: String,
      default: "", // Default value for BMI
    },
    city: {
      type: String,
      default: "", // Default value for city
    },
    country: {
      type: String,
      default: "", // Default value for country
    },
    verification_document: {
      type: String,
      default: "", // Default value for verification_document
    },
    verification_document_type: {
      type: String,
      default: "", // Default value for verification_document_type
    },
    verification_document_name: {
      type: String,
      default: "", // Default value for verification_document_name
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
