const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

exports.user_profile_get = asyncHandler(async (req, res) => {
  res.render("user_profile", {
    name: `${req.user.first_name} ${req.user.last_name}`,
    email: req.user.email,
  });
});

exports.join_club_get = asyncHandler(async (req, res) => {
  res.render("join_club_form");
});

exports.join_club_post = asyncHandler(async (req, res) => {
  const secretPasscode = "1245780";
  const { passcode } = req.body;
  const user = await User.findOne(req.user._id).exec();
  if (passcode === secretPasscode) {
    user.status = "member";
    await user.save();
    res.redirect("/");
  }
});

exports.create_message_get = asyncHandler(async (req, res) => {
  res.render("message_form", { title: "Create new post" });
});
