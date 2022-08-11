const express = require("express");
const router = express.Router({ mergeParams: true }); //express seperates router params and you will get null errors so always merge params
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middlewareAutho");

const catchAsync = require("../utils/catchAsync");

const reviewController = require("../controllers/reviews");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(reviewController.createReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviewController.deleteReview)
);

module.exports = router;
