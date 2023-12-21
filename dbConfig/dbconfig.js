const mongoose = require('mongoose');
require("dotenv").config();

const dbConnect = () => {
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => console.log("Connect"))
        .catch((error) => {
            console.log("Error");
            console.log(error.message);
            process.exit(1);
        });
}
module.exports = dbConnect;