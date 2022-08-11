const express = require("express");
const passport = require("passport");
const User = require("../models/user");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const authController = require("../controllers/auth");

router
  .route("/register")
  .get(authController.renderRegister)
  .post(catchAsync(authController.register));

router
  .route("/login")
  .get(authController.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    authController.login
  );

router.get("/logout", authController.logout);

module.exports = router;
