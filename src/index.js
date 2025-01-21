const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const router = require("./router/user.js");
const cors = require("cors");
const serverless = require("serverless-http"); // Add this line for serverless support

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

app.get("/", (req, res) => res.send("Express on Vercel"));

app.use((err, req, res, next) => {
  res.json({
    status: err.status || 500,
    message: err.message,
  });
});

module.exports.handler = serverless(app);
