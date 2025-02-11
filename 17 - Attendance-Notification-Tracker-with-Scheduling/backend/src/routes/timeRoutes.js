const express = require('express');
const router = express.Router();
const {
  timeIn,
  timeOut,
  updateTimeIn,
  updateTimeOut,
  deleteTime,
  getAllTimeRecords
} = require('../controllers/timeController');

// POST: Time In
router.post('/timeIn', timeIn);

// POST: Time Out
router.post('/timeOut', timeOut);

// PUT: Update Time In
router.put('/updateTimeIn', updateTimeIn);

// PUT: Update Time Out
router.put('/updateTimeOut', updateTimeOut);

// DELETE: Delete Time In/Out
router.delete('/deleteTime', deleteTime);

// GET: Get all time records (display all time-in and time-out records)
router.get('/all', getAllTimeRecords);

module.exports = router;
