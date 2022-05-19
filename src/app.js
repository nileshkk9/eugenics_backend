const express = require("express");
const app = express();
// require("./db/mysql");
require("dotenv").config();

const userRouter = require("./routes/user");
const reportRouter = require("./routes/report");

const errorlogger = require("./utils/errorLogger");

const port = process.env.port || 2222;

app.use(express.json());
app.use(userRouter);
app.use(reportRouter);
app.use(errorlogger);
app.listen(port, () => {
    console.log("server running at port",port);
})