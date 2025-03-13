require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

// Import routes
const empRoutes = require("./src/routes/emp"); // Make sure this points to 'routes/emp.js'
const scheduleRoutes = require("./src/routes/scheduleRoutes");
const timeRoutes = require("./src/routes/timeRoutes"); // Time routes (Time In / Time Out)

const app = express();

// Middleware to parse JSON data
app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type"],
  exposedHeaders: ["Content-Type"],
};
app.use(cors(corsOptions));
// Use routes
app.use("/api/employees", empRoutes); // Employee routes
app.use("/api/schedules", scheduleRoutes); // Schedule routes
app.use("/api/time", timeRoutes); // Time routes (Time In / Time Out)


const headerRoutes = require("./src/routes/header");

app.use("/api/header", headerRoutes);

// Serve static files from the "uploads" folder.
app.use("/uploads", express.static("uploads"));

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
