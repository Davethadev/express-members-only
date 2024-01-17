const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const Swal = require("sweetalert2");
// import "sweetalert2/src/sweetalert2.scss";

exports.sign_up_get = asyncHandler(async (req, res) => {
  res.render("sign_up_form");
});

exports.sign_up_post = [
  // Validate and sanitize fields.
  body("first_name", "First name must not be empty.")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("last_name", "Last name must not be empty.")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("email", "Email must not be empty").trim().escape(),
  body("password", "Please provide a password.")
    .trim()
    .isLength({ min: 6 })
    .escape(),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password do not match");
    }
    return true;
  }),
  body("is_admin").escape(),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Hash password
    const hashedPwd = await bcrypt.hash(req.body.password, 10);

    // Create a User object with escaped and trimmed data.
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: hashedPwd,
      isAdmin: req.body.is_admin === "on",
      //   password_confirmation: req.body.password_confirmation,
    });

    const { email } = req.body;
    const doesExist = await User.findOne({ email });
    if (doesExist) {
      Swal.fire({
        title: "Invalid email",
        text: "That email you provided already exists",
        icon: "error",
      });
    }

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      console.log(errors.array());
      res.render("sign_up_form", {
        user: user,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save user.
      await user.save();
      // req.flash(
      //   "success",
      //   `${user.email} registered succesfully, proceed to login with email and password`
      // );
      res.redirect("/auth/login");
    }
  }),
];

exports.login_get = asyncHandler(async (req, res) => {
  res.render("login_form");
});
