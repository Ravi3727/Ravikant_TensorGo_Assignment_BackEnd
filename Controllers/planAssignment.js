const PlanAssignment = require('../Models/planAssignment');
const Organization = require('../Models/organization');
const Plan = require('../Models/plans');
const User = require('../Models/user');
const mongoose = require("mongoose");

exports.createAssignment = async (req, res) => {
    try {
        const { organizationId, planId, email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        const userId = user._id;

        const organization = await Organization.findById(organizationId);
        if (!organization) return res.status(404).json({ message: 'Organization not found' });

        const plan = await Plan.findById(planId);
        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        const existingAssignment = await PlanAssignment.findOne({ plan: planId, organization: organizationId, user: userId });
        if (existingAssignment) {
            return res.status(400).json({ message: 'User is already assigned to this plan' });
        }

        const userCount = await PlanAssignment.countDocuments({ organization: organizationId, plan: planId });
        if (userCount >= plan.maxUsers - 1) {
            return res.status(400).json({ message: 'User limit for this plan reached' });
        }

        const assignment = new PlanAssignment({ plan: planId, organization: organizationId, user: userId });
        await assignment.save();

        res.status(201).json({ message: 'User assigned to plan successfully', assignment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAssignments = async (req, res) => {
    try {
        const planId = req.query.planId;
        const assignments = await PlanAssignment.find({ plan: planId }).populate('user', 'username email');
        if (!assignments.length) {
            return res.status(404).json({ message: 'No users assigned to this plan' });
        }

        res.status(200).json({ users: assignments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


exports.removeUserFromPlan = async (req, res) => {
    try {
        const { organizationId, planId, email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        const userId = user._id;
        const organization = await Organization.findById(organizationId);
        if (!organization) return res.status(404).json({ message: 'Organization not found' });

        const plan = await Plan.findById(planId);
        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        const existingAssignment = await PlanAssignment.findOne({ plan: planId, organization: organizationId, user: userId });
        if (!existingAssignment) {
            return res.status(404).json({ message: 'User is not assigned to this plan' });
        }
        await PlanAssignment.deleteOne({ _id: existingAssignment._id });

        res.status(200).json({ message: 'User removed from plan successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getUserPlanByUserId = async (req, res) => {
    try {
        const {userId} = req.params;
        // console.log(req);
        console.log(userId);
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const assignments = await PlanAssignment.find({ user: userId })
            .populate('organization', 'name')
            .populate('plan', 'name description price duration maxUsers');

        if (!assignments.length) {
            return res.status(404).json({ message: "No plans or organizations found for this user" });
        }

        const result = assignments.map((assignment) => ({
            organization: assignment.organization,
            plan: assignment.plan,
        }));

        res.status(200).json({ user: user.username, assignments: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


