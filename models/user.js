const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const createErrors = require("http-errors");

const UserSchema = new Schema({
  first_name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  last_name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  password_confirmation: {
    type: String,
    minLength: 6,
  },
  status: { type: String, default: "user" },
  isAdmin: { type: Boolean, default: false },
});

UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw createErrors.InternalServerError(error.message);
  }
};

module.exports = mongoose.model("User", UserSchema);
