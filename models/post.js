const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { DateTime } = require("luxon");

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    post: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    date_created: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

PostSchema.virtual("date_formatted").get(function () {
  return this.date_created.toDateString();
});

PostSchema.virtual("url").get(function () {
  return `/post/${this._id}`;
});

module.exports = mongoose.model("Post", PostSchema);
