const express = require("express");
const router = express.Router();
const auth_controller = require("../controllers/auth");
const passport = require("passport");
const checkAuthenticated = require("../middleware/checkAuthenticated");

// AUTH ROUTES

// Get sign up form
router.get("/signup", checkAuthenticated, auth_controller.sign_up_get);

// Post request to handle new user sign up
router.post("/signup", checkAuthenticated, auth_controller.sign_up_post);

// Get login form after sign up
router.get("/login", checkAuthenticated, auth_controller.login_get);

// Post request to handle user login
router.post(
  "/login",
  checkAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })
);

// Get request to handle user log out
router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/auth/login");
  });
});

module.exports = router;
