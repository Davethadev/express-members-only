const express = require("express");
const router = express.Router();
const message_controller = require("../controllers/post");

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// Get list of posts
router.get("/", message_controller.index);

module.exports = router;
