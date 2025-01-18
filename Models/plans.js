const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  maxUsers: { type: Number, required: true },
  features: [String],
});

module.exports = mongoose.model("Plan", planSchema);