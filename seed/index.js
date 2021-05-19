const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./ind.js");
const { descriptors, places } = require("./seedHelper");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 400; i++) {
    const rand = Math.floor(Math.random() * 100);
    const price = Math.floor(Math.random() * 20) + 5;
    // const lon = cities[rand].lon;
    // const lat = cities[rand].lat;
    const camp = new Campground({
      //my user id
      author: "60937afcf4e2cb0a20d04b19",
      location: `${cities[rand].city}  ${cities[rand].state}`,
      title: `${sample(descriptors)}  ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [
          parseFloat(cities[rand].lng),
          parseFloat(cities[rand].lat),
        ],
      },
      images: [
        {
          url: "https://images.unsplash.com/photo-1560577831-324429d1c7f1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHJhaW55JTIwZm9yZXN0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          filename: "YelpCamp/ot2c0qgg78ht9lrpgnp9",
        },
        {
          url: "https://images.unsplash.com/photo-1581294078997-84850bb246c7?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDN8fHJhaW55JTIwZm9yZXN0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          filename: "YelpCamp/zfygjhszetnrpgfiboja",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium error temporibus magnam omnis perferendis quod, impedit inventore natus iure laborum repudiandae repellat pariatur nihil, adipisci itaque, suscipit sint aspernatur velit!",
      price,
    });
    await camp.save();
  }
};
seedDb().then(() => {
  mongoose.connection.close();
});
