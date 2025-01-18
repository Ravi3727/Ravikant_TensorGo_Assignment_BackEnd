const Organization = require('../Models/organization');
const User = require('../Models/user');


// exports.createOrganization = async (req, res) => {
//     try {
//         const { name, planId, userId } = req.body;

//         if (!userId || !planId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User ID and Plan ID are required fields"
//             });
//         }

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         let organization = await Organization.findOne({ userId });

//         if (organization) {
//             if (!organization.planId.includes(planId)) {
//                 organization.planId.push(planId);
//                 await organization.save();
//             }

//             return res.status(200).json({
//                 success: true,
//                 message: "Plan ID added to the existing organization",
//                 data: organization
//             });
//         }

//         user.isAdmin = true;
//         await user.save();

//         const newOrganization = new Organization({
//             name: name || 'Org_1',
//             planId: [planId],
//             userId
//         });

//         await newOrganization.save();

//         res.status(201).json({
//             success: true,
//             message: "Organization created successfully",
//             data: newOrganization
//         });
//     } catch (error) {
//         console.error('Error creating/updating organization:', error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to create/update organization",
//             error: error.message
//         });
//     }
// };

exports.getOrganizations = async (req, res) => {
    try {
        // Assuming `req.user` contains the logged-in user's details
        // console.log(req);
        const userId = req.query.userId; 
        // console.log("User ID", userId);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // console.log("User  found", user);
        // console.log("User  found", user.isSuperAdmin);
        if (!user.isSuperAdmin) {
            return res.status(403).json({
                success: false,
                message: "Access denied: Only Super Admins can view organizations"
            });
        }

        const organizations = await Organization.find()
            .populate('planId')
            .populate('userId');

        res.status(200).json({
            success: true,
            message: "Organizations retrieved successfully",
            data: organizations
        });
    } catch (error) {
        console.error('Error fetching organizations:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch organizations",
            error: error.message
        });
    }
};

exports.updateOrganization = async (req, res) => {
    try {
        const { id } = req.params; 
        const updateData = req.body;

        const updatedOrganization = await Organization.findByIdAndUpdate(id, updateData, {
            new: true
        })
            .populate('planId')
            .populate('userId');

        if (!updatedOrganization) {
            return res.status(404).json({
                success: false,
                message: "Organization not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Organization updated successfully",
            data: updatedOrganization
        });
    } catch (error) {
        console.error('Error updating organization:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update organization",
            error: error.message
        });
    }
};

exports.deleteOrganization = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedOrganization = await Organization.findByIdAndDelete(id);

        if (!deletedOrganization) {
            return res.status(404).json({
                success: false,
                message: "Organization not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Organization deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting organization:', error);
        res.status(500).json({
            success: false,
            message: "Failed to delete organization",
            error: error.message
        });
    }
};

exports.getUserOrganizations = async (req, res) => {
    try {
        const userId = req.query.userId;  

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const organizations = await Organization.find({ userId })
            .populate('planId') 
            .populate('userId'); 

        if (organizations.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No organizations found for this user"
            });
        }

        res.status(200).json({
            success: true,
            message: "Organizations retrieved successfully",
            data: organizations
        });
    } catch (error) {
        console.error('Error fetching user organizations:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user organizations",
            error: error.message
        });
    }
};
