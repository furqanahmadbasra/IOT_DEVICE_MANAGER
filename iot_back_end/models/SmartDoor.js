const mongoose = require('mongoose');

const smartDoorSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    index: true,          
  },
  locked: {
    type: Boolean,
    required: true,
  },
  lastAccessedBy: {
    type: String,
    default: 'Unknown',
  },
  accessTime: {
    type: Date,
    default: Date.now,
  },
  batteryStatus: {
    type: Number,        
    min: 0,
    max: 100,
    required: true,
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'online',
  }
}, {
  timestamps: true       
});

module.exports = mongoose.model('SmartDoor', smartDoorSchema);
