const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/user");
const post_controller = require("../controllers/post");

/* GET users listing. */
router.get("/profile", user_controller.user_profile_get);

// Get join club form
router.get("/join", user_controller.join_club_get);

// Handle user joining the club
router.post("/join", user_controller.join_club_post);

// Get create message form
router.get("/post/create", user_controller.create_message_get);

// Handle create message on post
router.post("/post/create", post_controller.create_message_post);

// Get delete post form
router.get("/post/:id/delete", post_controller.delete_message_get);

// Handle delete post on post
router.post("/post/:id/delete", post_controller.delete_message_post);

// Get list of posts
router.get("/", post_controller.index);

module.exports = router;
