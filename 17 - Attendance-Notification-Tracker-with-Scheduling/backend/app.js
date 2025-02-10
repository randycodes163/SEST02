require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Import routes
const empRoutes = require("./routes/emp");
const scheduleRoutes = require("./routes/scheduleRoutes");

const app = express();

// Middleware to parse JSON data
app.use(bodyParser.json());

// Use routes
app.use("/api/employees", empRoutes); // Employee routes
app.use("/api/schedules", scheduleRoutes); // Schedule routes

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    // Get the connection instance for the correct database
    const db = mongoose.connection.useDb("veco_db"); // Use the 'veco_db' database
    console.log("Connected to MongoDB veo_db");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
