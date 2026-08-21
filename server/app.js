const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const { MongoStore } = require("connect-mongo");

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

require("./src/config/passport.js");

const app = express();

for (const key of ["MONGO_URI", "SESSION_SECRET"]) {
  if (!process.env[key]) {
    console.error(`${key} is not set. Add it to server/.env — see DEPLOY.md section 7.`);
    process.exit(1);
  }
}

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const allowedOrigins = new Set(
  [
    clientUrl,
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "https://saarthi-mail.vercel.app",
  ]
    .filter(Boolean)
    .map((origin) => origin.replace(/\/+$/, ""))
);
const isAllowedVercelPreview = (origin = "") =>
  /^https:\/\/saarthi-mail-[a-z0-9-]+\.vercel\.app$/i.test(origin);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/+$/, "");
    if (allowedOrigins.has(normalizedOrigin) || isAllowedVercelPreview(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const { SESSION_COOKIE_NAME, sessionCookieOptions } = require("./src/config/sessionCookie.js");

app.set("trust proxy", 1);

app.use(cors(corsOptions));
app.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);
  return next();
});

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
    name: SESSION_COOKIE_NAME,
    cookie: {
      ...sessionCookieOptions(),
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());

app.use(passport.session());

const mailroutes = require("./src/routes/mails.routes.js");

const authroutes = require("./src/routes/auth.routes.js");

const gmailRoutes = require("./src/routes/gmail.routes.js");

const { ensureAuthenticated } = require("./src/middlewares/auth.middleware.js");

app.get("/", (req, res) => {
  res.send("Saarthi mail api running");
});

app.use("/api/mail", ensureAuthenticated, mailroutes);

app.use("/api/auth", authroutes);

app.use("/api/gmail", ensureAuthenticated, gmailRoutes);

module.exports = app;
