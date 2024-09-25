const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  busFrom: { type: String, required: true },
  busTo: { type: String, required: true },
  busDate: { type: Date, required: true },
  busName: { type: String, required: true },
  busPrice: { type: Number, required: true },
  totalSeats: { type: Number, required: true },
  totalTime: { type: String, required: true },
  busDescription: { type: String, required: true },
  busImage: { type: String, required: true },
});

const Bus = mongoose.model("Bus", busSchema);

module.exports = Bus;
