// install (ejs, morgan, init, mongoose)

const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file

const express = require('express');
const mongoose = require("mongoose"); // require package
const app = express();

// Connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Import the Fruit model
const Fruit = require("./models/fruit.js");

const morgan = require('morgan');
app.use(morgan('dev'));

// use the modle to convert to HTTP
app.use(express.urlencoded({ extended: false }));

/* ----------------------------------------------------------setup -------------------------------*/

// GET /
app.get("/", async (req, res) => {
  res.render("index.ejs");
});

// GET /fruits/new
app.get("/fruits/new", (req, res) => {
  res.render("fruits/new.ejs");
});

// POST /fruits
app.post("/fruits", async (req, res) => {
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  await Fruit.create(req.body);
  res.redirect("/fruits/new");
});

// GET /fruits
app.get("/fruits", async (req, res) => {
  const allFruits = await Fruit.find();
  //console.log(allFruits); // log the fruits!
  res.render("fruits/index.ejs", { fruits: allFruits });
});


/* ---------------------------------------------------------- Path */




/* ----------------------------------------------TCP port */
app.listen(3000, () => {
  console.log('Listening on port 3000');
});