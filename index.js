const express = require("express");
const errorHandler = require("./middleware/app.js");
const logger = require("./middleware/logger");
const server = require("./server");
const router = require("./router");
const cookieParser = require("cookie-parser");
const connectDB = require('./config/db');
const { model } = require("mongoose");

const app = express();
app.use(cookieParser());
connectDB();

const port = process.env.port || 5432;

app.use(express.json());
app.use(logger);
app.use(errorHandler);
app.use("/api", router);

app.listen(port, () => console.log(`${port}`));

