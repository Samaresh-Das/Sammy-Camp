const cloudinary = require("cloudinary").v2;
const { model } = require("mongoose");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "yelpcamp",
    allowedFormats: ["jpeg", "png", "jpg"], // supports promises as well
  },
});

module.exports = {
  cloudinary,
  storage,
};
