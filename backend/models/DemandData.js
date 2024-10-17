
const mongoose = require('mongoose');

const DemandDataSchema = new mongoose.Schema({
  region: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  requests: { type: Number, default: 0 },
  availableDrivers: { type: Number, default: 0 },
});

module.exports = mongoose.model('DemandData', DemandDataSchema);
