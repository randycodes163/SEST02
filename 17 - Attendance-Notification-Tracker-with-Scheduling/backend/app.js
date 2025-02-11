require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");

// Import routes
const empRoutes = require("./src/routes/emp"); // Make sure this points to 'routes/emp.js'
const scheduleRoutes = require("./src/routes/scheduleRoutes");
const timeRoutes = require("./src/routes/timeRoutes");  // Time routes (Time In / Time Out)

const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Use routes
app.use("/api/employees", empRoutes); // Employee routes
app.use("/api/schedules", scheduleRoutes); // Schedule routes
app.use("/api/time", timeRoutes);  // Time routes (Time In / Time Out)

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.info(
        `Listening on port ${process.env.PORT} and connected to MongoDB Atlas.`
      );
    });
  })
  .catch((error) => {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  });

