const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
       dated:{
            type: 'number',
            required:true,
       },
        Task: {
            type: 'string',
            required: true,
        },
        email:{
            type:'string',
        },
    }
);

module.exports = mongoose.model("task", taskSchema);
