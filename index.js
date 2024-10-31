const express = require('express');
const app = express();
const cors = require('cors'); // Import cors module
const cookieParser = require('cookie-parser');
require("dotenv").config();
app.use(express.json());
app.use(cors({
    origin: 'https://experimentlab.vercel.app', // Replace with your frontend origin
    credentials: true, // Allow cookies to be sent
}));

app.use(cookieParser());

const user = require("./Routes/user");
const addevents = require("./Routes/event");
const addmeetings = require("./Routes/meeting");
console.log("index call");
app.get("/", function(req, res) {
    res.send("Hello World");
});
app.use("/ravi/v1/users", user);
app.use("/ravi/v1", addevents);
app.use("/ravi/v1", addmeetings);

const PORT = process.env.PORT || 4000;


app.listen(PORT, () => {
    console.log(`server start at this port ${PORT}`);
});


const dbConnect = require("./dbConfig/dbconfig");
dbConnect();