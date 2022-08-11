const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("userAuth/register");
};

module.exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      //otherwise
      req.flash("success", "Welcome to yelpcamp");
      res.redirect("/campgrounds");
    }); //to login the user
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/register");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("userAuth/login");
};

module.exports.login = (req, res) => {
  //default passport middleware given by passport
  req.flash("success", "Welcome back");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/campgrounds");
};
