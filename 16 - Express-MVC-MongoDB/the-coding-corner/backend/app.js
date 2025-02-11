require("dotenv").config();

const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const app = express();

// Middleware
app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Type"],
};
app.use(cors(corsOptions));

// Routes
app.use("/api/posts", require("./src/routes/post"));
app.use("/api/users", require("./src/routes/user"));

// Connect to the MongoDB Cluster
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