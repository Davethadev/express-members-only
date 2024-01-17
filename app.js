require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const session = require("express-session");
const connectFlash = require("connect-flash");
const ensureAuthenticated = require("./middleware/ensureAuthenticated");
const errorHandlerMiddleware = require("./middleware/error-handler");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

const app = express();

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = process.env.PORT || process.env.MONGO_URI;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  console.log("Connected to MongoDB");
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const MongoStore = require("connect-mongo");

// const sessionStore = new MongoStore({
//   mongooseConnection: mongoose.connection,
//   collection: "sessions",
// });
// Init Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

// For Passport JS Authentication
app.use(passport.initialize());
app.use(passport.session());
require("./auth/passport");

app.use(function (req, res, next) {
  res.locals.user = req.user;
  // console.log("User: ", user);
  // console.log("User (Request): ", req.user);
  next();
});

// Connect Flash
app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.use("/", indexRouter);
app.use("/user", ensureAuthenticated, usersRouter);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(errorHandlerMiddleware);

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

module.exports = app;
