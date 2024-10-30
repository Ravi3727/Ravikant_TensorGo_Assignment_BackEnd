const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema(
    {
        title: {
            type: 'string',
            required: true,
        },
        description: {
            type: 'string',
            required: true,
        },
        dated: {
            type: 'string',
            required: true,
        },
        time:{
            type: 'string',
            required: true,
        }
    }
);

module.exports = mongoose.model("meeting", meetingSchema);