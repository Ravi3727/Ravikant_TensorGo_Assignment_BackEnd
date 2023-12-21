const express = require('express');
const app = express();
const cors = require('cors'); // Import cors module

require("dotenv").config();

app.use(express.json());
app.use(cors()); // Use cors middleware

const task = require("./Routes/task");

console.log("index call");
app.use("/ravi/v1", task);

const PORT = process.env.PORT || 4000;


app.listen(PORT, () => {
    console.log(`server start at this port ${PORT}`);
});


const dbConnect = require("./dbConfig/dbconfig");
dbConnect();
