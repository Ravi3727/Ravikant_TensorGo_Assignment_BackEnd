require("dotenv").config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { stripeWebhook } = require('./Controllers/payment');
const app = express();



app.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);



app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());



const user = require("./Routes/user");
const addPlan = require("./Routes/plan");
const addOrg = require("./Routes/organization");
const assignment = require("./Routes/planAssignment");
const payment = require("./Routes/payment");
const { paymentSuccess } = require('./Controllers/payment');
const { cancelPayment } = require('./Controllers/payment');


app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/payment/success", paymentSuccess);
app.get("/cancel", cancelPayment);
app.use("/ravi/v1/users", user);
app.use("/ravi/v1", addPlan);
app.use("/ravi/v1", addOrg);
app.use("/ravi/v1", assignment);
app.use("/ravi/v1", payment);


const PORT = process.env.PORT || 5000;
const dbConnect = require("./dbConfig/dbconfig");

try {
    dbConnect();
    console.log("Database connected successfully");
} catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); 
}

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});

process.on('SIGINT', () => {
    console.log("Gracefully shutting down...");
    process.exit(0);
});
