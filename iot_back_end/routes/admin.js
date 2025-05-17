const express = require("express");
const router = express.Router();
const SmartDoor = require("../models/SmartDoor")
const { param, validationResult } = require('express-validator');



router.post("/submit_iot_data/:id", [
    param('id').notEmpty().withMessage('Device ID is required')
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const iot_device_id = req.params.id;

    const {
        locked,
        lastAccessedBy,
        batteryStatus,
        status
    } = req.body;

    try {

        let existingDevice = await SmartDoor.findOne({ deviceId: iot_device_id });

        if (existingDevice) {
            return res.status(400).json({ message: 'Device already exists' });
        }


        const newDevice = new SmartDoor({
            deviceId: iot_device_id,
            locked,
            lastAccessedBy,
            batteryStatus,
            status
        });

        await newDevice.save();
        res.status(201).json({ message: 'Device added successfully', data: newDevice });

    } catch (err) {
        console.error("Error saving IoT data:", err);
        res.status(500).json({ message: 'Server error' });
    }
});



router.put('/update_iot_data/:id', async (req, res) => {

    // console.log("fucasdfadfadsf")
    const iot_device_id = req.params.id;
    const { locked, lastAccessedBy, batteryStatus, status } = req.body;

    try {
        let device = await SmartDoor.findOne({ deviceId: iot_device_id });

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        device.locked = locked;
        device.lastAccessedBy = lastAccessedBy;
        device.batteryStatus = batteryStatus;
        device.status = status;

        await device.save();

        res.status(200).json({ message: 'Device updated successfully', data: device });
    } catch (err) {
        console.error("Error updating device:", err);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/get_all_iot_data', async (req, res) => {
    try {
        const devices = await SmartDoor.find({});
        res.status(200).json(devices);
    } catch (err) {
        console.error("Error fetching all devices:", err);
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router