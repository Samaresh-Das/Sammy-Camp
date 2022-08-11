if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const port = process.env.PORT || 8000;
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");
const MongoDBStore = require("connect-mongo")(session);

const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const authRoutes = require("./routes/auth");
// "mongodb://localhost:27017/yelp-camp"
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
// const dbUrl2 = "mongodb://localhost:27017/yelp-camp";

mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
app.use(mongoSanitize());

const secret = process.env.SECRET || "rjhf3ruihf";
const store = new MongoDBStore({
  url: dbUrl,
  secret,
  touchAfter: 24 * 3600, //in seconds
});

store.on("error", function (e) {
  console.log(e);
});

const sessionConfig = {
  store,
  name: "hwbd",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    //secure: true, //it'll only use https but localhost is not https secured
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //mili-seconds in a week XD
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig)); //it should always be before passport session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // this tells passport how to serialize user
passport.deserializeUser(User.deserializeUser()); // this tells passport how to deserialize user

app.use((req, res, next) => {
  //flash middleware

  res.locals.currentUser = req.user; //to toggle nav button on authorizations
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", authRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  //all indicates do this for every single requests and * indicates all paths and also where you declare this matters. I recommend declaring it at last before err func
  next(new ExpressError("Page Not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err; //giving them a default using equals sign
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
