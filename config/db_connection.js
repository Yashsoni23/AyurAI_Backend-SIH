const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get the default connection
const db = mongoose.connection;

// Event handlers for the MongoDB connection
db.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

db.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// Close the Mongoose connection when the Node.js process is terminated
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed through app termination");
    process.exit(0);
  });
});
