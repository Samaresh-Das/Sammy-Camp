const { campgroundJoiSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.user); //it contains data about the user except password by passport, it will come handy.
  if (!req.isAuthenticated()) {
    //store the url they are requesting
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};

//creating validate middleware
module.exports.validateCamp = (req, res, next) => {
  const { error } = campgroundJoiSchema.validate(req.body); //passing the data through schema for validation
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//creating authorization middleware
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  //if the author of the campground matches the currently logged in user
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}; //should always be before

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  //if the author of the campground matches the currently logged in user
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
