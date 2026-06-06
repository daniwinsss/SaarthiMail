const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const { MongoStore } = require("connect-mongo");

require("./src/config/passport.js");

const app = express();

const isProduction = process.env.NODE_ENV === "production";
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

app.set("trust proxy", 1);

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 14 * 24 * 60 * 60 * 1000,
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