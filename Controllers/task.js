const taskModel = require("../Models/task");
const nodemailer = require("nodemailer");

exports.createTask = async (req, res) => {
    try {
        const { dated, Task, email} = req.body;
        if (!dated || !Task ) {
            res.status(404).json({
                success: false,
                message: "Please enter required fields"
            })
        }else{
            const newTask = new taskModel({ dated, Task ,email });
            const response = await newTask.save();
            res.status(200).json({
                success: true,
                data: response,
                message: "Task created successfully"
            });


             // Send email
             let transporter = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                },
            });
    
            const mailOptions = {
                from: 'Ravi',
                to: email, 
                subject: 'Task Created Successfully',
                text: `A new task has been created for ${dated}. Task details: ${Task}`,
            };
    
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });
        }

            
    } 
    catch (err) {
        console.error('Error creating task:', err);
        res.status(500).json({
            success: false,
            data: 'Error creating',
            message: err.message,
        });
    }
}