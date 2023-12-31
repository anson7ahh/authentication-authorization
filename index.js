const express = require("express")
const app = express()
const port = 3000;
const bodyParser = require('body-parser')
require('dotenv').config()
const router = require("./router/user.js")
const Authrouter = require("./router/auth.js")
require('./config/passport')(app)

const cors = require('cors');
const passport = require('passport')
app.use(cors());
app.use(express.json())




app.use("/", router);
app.use("/", Authrouter)





app.use((req, res, next) => {
    next(createError.NotFound('ko tim thay router'));
});

app.use((err, req, res, next) => {
    res.json({
        status: err.status || 500,
        message: err.message,
    });
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
