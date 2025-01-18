const mongoose = require("mongoose");


const organizationSchema = new mongoose.Schema({
  name: { type: String, required: false, default: 'Org_1' },
  planId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plan' }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});


module.exports = mongoose.model("Organization", organizationSchema);