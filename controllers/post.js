const Post = require("../models/post");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res) => {
  const allPosts = await Post.find({}).sort({ date_created: -1 }).exec();
  res.render("index", { posts: allPosts });
});

exports.create_message_post = [
  // Validate and sanitize fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("post", "Post must not be empty.").trim().isLength({ min: 1 }).escape(),
  // body("author", "Post author must not be empty.")
  //   .trim()
  //   .isLength({ min: 1 })
  //   .escape(),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    console.log("Current User: ", req.user);
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Post object with escaped and trimmed data.

    const post = new Post({
      title: req.body.title,
      post: req.body.post,
      author: `${req.user.first_name} ${req.user.last_name}`,
      //   password_confirmation: req.body.password_confirmation,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      res.render("message_form", {
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save user.
      await post.save();
      res.redirect("/");
    }
  }),
];

exports.delete_message_get = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post === null) {
    // No posts
    res.redirect("/");
  }
  res.render("post_delete", { title: "Delete post", post: post });
});

exports.delete_message_post = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post === null) {
    // No posts
    res.redirect("/");
  }
  await Post.findByIdAndDelete(req.body.id);
  res.redirect("/");
});
