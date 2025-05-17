const express = require("express");
const router = express.Router();
const SmartDoor = require("../models/SmartDoor")
const { body , validationResult } = require('express-validator');





router.get('/get_iot_data', async (req, res) => {
  try {
    const data = await SmartDoor.find().sort({ createdAt: -1 }).limit(100);
    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('Error fetching IoT data:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router