const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const router = require("./router/user.js");
require("./config/passport.js")(app);
const cors = require("cors");
const passport = require("passport");

const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use("/", router);
app.get("/", (req, res) => res.send("Express on Vercel"));
app.use((req, res, next) => {
  next(createError.NotFound("ko tim thay router"));
});

app.use((err, req, res, next) => {
  res.json({
    status: err.status || 500,
    message: err.message,
  });
});
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
module.exports = app;
