const Plan = require('../Models/plans');
const User = require('../Models/user');
exports.createPlan = async (req, res) => {
    try {
        const { name, description, price, duration, maxUsers, features } = req.body;
        if (!name || !description || !price) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields (name, description, price, duration,maxUsers,features)"
            });
        }

        const newPlan = new Plan({ name, description, price, duration, maxUsers, features });
        await newPlan.save();

        res.status(201).json({
            success: true,
            message: "Plan created successfully",
            data: newPlan
        });
    } catch (error) {
        console.error('Error creating plan:', error);
        res.status(500).json({
            success: false,
            message: "Failed to create plan",
            error: error.message
        });
    }
};

exports.getPlans = async (req, res) => {
    try {
        const plans = await Plan.find();
        res.status(200).json({
            success: true,
            message: "Plans retrieved successfully",
            data: plans
        });
    } catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch plans",
            error: error.message
        });
    }
};

exports.updatePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedPlan = await Plan.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedPlan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Plan updated successfully",
            data: updatedPlan
        });
    } catch (error) {
        console.error('Error updating plan:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update plan",
            error: error.message
        });
    }
};

exports.deletePlan = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPlan = await Plan.findByIdAndDelete(id);

        if (!deletedPlan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Plan deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting plan:', error);
        res.status(500).json({
            success: false,
            message: "Failed to delete plan",
            error: error.message
        });
    }
};