const mongoose = require("mongoose");

const planAssignmentSchema = new mongoose.Schema({
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

planAssignmentSchema.index({ plan: 1, organization: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("PlanAssignment", planAssignmentSchema);