const express = require("express");
const database = require("./database");
const router = require("./router");

const app = express();

const port = process.env.port || 3000;

app.use(express.json());
app.use("/api", router);



app.listen(port, () => console.log(`${port}`));