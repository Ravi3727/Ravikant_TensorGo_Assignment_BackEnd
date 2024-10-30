const User = require("../Models/user");

exports.createEvent = async (req, res) => {
    try {
        const { dated, title, description, time,id } = req.body;
        if (!dated || !title || !description || !time) {
            res.status(404).json({
                success: false,
                message: "Please enter required fields"
            })
        } else {
            const newEvent = {
                dated,
                title,
                description,
                time
            }

            console.log("request ki body", id); 

            const user = await User.findOne({ _id: id });

            console.log("User " ,user);

            if (user) {
                user.events.push(newEvent);
                await user.save();
            }
            res.status(200).json({
                success: true,
                data: user.events,
                message: "Event created successfully"
            });
        }
    }
    catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({
            success: false,
            data: 'Error creating',
            message: err.message,
        });
    }
}

exports.createMeeting = async (req, res) => {
    try {
        const { dated, title, description, time,id } = req.body;
        if (!dated || !title || !description || !time) {
            res.status(404).json({
                success: false,
                message: "Please enter required fields"
            })
        } else {
            const newMeeting = {
                dated,
                title,
                description,
                time
            }
            const user = await User.findOne({ _id: id });
            if (user) {
                user.meetings.push(newMeeting);
                await user.save();
            }
            res.status(200).json({
                success: true,
                data: user.meetings,
                message: "Meeting created successfully"
            });
        }
    }
    catch (err) {
        console.error('Error creating meeting:', err);
        res.status(500).json({
            success: false,
            data: 'Error creating',
            message: err.message,
        });
    }
}

exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;  // Event or Meeting ID
        const { userId } = req.query; // ID of the event to delete
        // const user = await User.findOne({ _id: id }); // ID of the authenticated user

        // Find and update the user, removing the event with the matching ID from the events array
        const result = await User.findByIdAndUpdate(
            userId,
            { $pull: { events: { _id: id } } },
            { new: true }
        );

        // Check if the event was found and deleted
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Event not found or already deleted"
            });
        }

        res.status(200).json({
            success: true,
            message: "Event deleted successfully",
            data: result.events
        });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({
            success: false,
            message: 'Error deleting event',
            error: err.message,
        });
    }
};

exports.deleteMeeting = async (req, res) => {
    try {
        const { id } = req.params;  // Event or Meeting ID
        const { userId } = req.query;  // Get userId from query parameters

        const result = await User.findByIdAndUpdate(
            userId,
            { $pull: { meetings: { _id: id } } },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found or already deleted"
            });
        }

        res.status(200).json({
            success: true,
            message: "Meeting deleted successfully",
            data: result.meetings // Correct the field name to `meetings`
        });
    } catch (err) {
        console.error('Error deleting meeting:', err);
        res.status(500).json({
            success: false,
            message: 'Error deleting meeting',
            error: err.message,
        });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params; // Event ID to be updated
        const {userId} = req.body; // Authenticated user's ID
        const updateData = req.body; // New data for the event

        // Use $set to update the specific event in the events array
        const result = await User.findOneAndUpdate(
            { _id: userId, "events._id": id },
            {
                $set: {
                    "events.$.title": updateData.title,
                    "events.$.description": updateData.description,
                    "events.$.dated": updateData.dated,
                    "events.$.time": updateData.time,
                },
            },
            { new: true }
        );

        // If no matching event is found, return 404
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Event updated successfully",
            data: result.events
        });
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).json({
            success: false,
            message: 'Error updating event',
            error: err.message,
        });
    }
};

exports.updateMeeting = async (req, res) => {
    try {
        const { id } = req.params; // Meeting ID to be updated
        const {userId} = req.body; // Authenticated user's ID
        const updateData = req.body; // New data for the meeting

        // Use $set to update the specific meeting in the meetings array
        const result = await User.findOneAndUpdate(
            { _id: userId, "meetings._id": id },
            {
                $set: {
                    "meetings.$.title": updateData.title,
                    "meetings.$.description": updateData.description,
                    "meetings.$.dated": updateData.dated,
                    "meetings.$.time": updateData.time,
                },
            },
            { new: true }
        );

        // If no matching meeting is found, return 404
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Meeting updated successfully",
            data: result.meetings
        });
    } catch (err) {
        console.error('Error updating meeting:', err);
        res.status(500).json({
            success: false,
            message: 'Error updating meeting',
            error: err.message,
        });
    }
};