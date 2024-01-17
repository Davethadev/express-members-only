const checkAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("back");
  } else {
    next();
  }
};

module.exports = checkAuthenticated;
