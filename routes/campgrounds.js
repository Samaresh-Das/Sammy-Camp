const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCamp } = require("../middlewareAutho");
const controllers = require("../controllers/campground");
const { storage } = require("../cloudinary"); //node auto looks for index js files
const multer = require("multer");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(controllers.index)) //new page
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCamp,
    catchAsync(controllers.createCampground) //new page post
  );

router.get("/new", isLoggedIn, controllers.renderNewForm);
//new page
//order matters here, always put new before
router
  .route("/:id")
  .get(catchAsync(controllers.showCampground)) //show page
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCamp,
    catchAsync(controllers.updateCampground)
  ) ////edit put
  .delete(isLoggedIn, isAuthor, catchAsync(controllers.deleteCampground));

router.get(
  //edit page
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(controllers.renderEditForm)
);

module.exports = router;
