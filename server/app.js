const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

require("./src/config/passport.js");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: {
      secure: false,
    },
  })
);

app.use(passport.initialize());

app.use(passport.session());

const mailroutes = require("./src/routes/mails.routes.js");

const authroutes = require("./src/routes/auth.routes.js");

const gmailRoutes = require("./src/routes/gmail.routes.js");

app.get("/", (req, res) => {
  res.send("Saarthi mail api running");
});

app.use("/api/mail", mailroutes);

app.use("/api/auth", authroutes);

app.use("/api/gmail", gmailRoutes);

module.exports = app;