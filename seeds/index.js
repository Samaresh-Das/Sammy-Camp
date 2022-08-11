const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "62ecba5e31fe9dc9145191b9",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,

      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim tempore tempora maxime reprehenderit ipsum rerum recusandae, distinctio tenetur labore quasi, culpa, omnis doloribus. Neque quis ducimus hic eum ut perspiciatis?",
      price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/sam679/image/upload/v1660058351/yelpcamp/bridkbp4vdrjayoj8avx.jpg",
          filename: "yelpcamp/bridkbp4vdrjayoj8avx",
        },
        {
          url: "https://res.cloudinary.com/sam679/image/upload/v1660058352/yelpcamp/sbfe3ssmpqrsog0fcqzd.jpg",
          filename: "yelpcamp/sbfe3ssmpqrsog0fcqzd",
        },
        {
          url: "https://res.cloudinary.com/sam679/image/upload/v1660058353/yelpcamp/qlt8ulvkp9cgyazdjr7l.jpg",
          filename: "yelpcamp/qlt8ulvkp9cgyazdjr7l",
        },
      ],
    });
    await camp.save();
  }
};

seedDb().then(() => {
  mongoose.connection.close();
});
