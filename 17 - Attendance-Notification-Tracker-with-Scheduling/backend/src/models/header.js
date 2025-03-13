const mongoose = require("mongoose");

const db = mongoose.connection.useDb("attendance_db");

const headerSchema = new mongoose.Schema({
  photo: { type: String, required: true }
});

const Header = db.model("Header", headerSchema);

module.exports = Header;
