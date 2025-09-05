// install (ejs, morgan, init, mongoose) and npm i method-override morgan to delete from DB

const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file

const express = require('express');
const mongoose = require("mongoose"); // require package
const methodOverride = require("method-override"); // method-override morgan
const app = express();

// Connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});


const Fruit = require("./models/fruit.js"); // Import the Fruit model

const morgan = require('morgan'); // morgan to see all errors and dignosis
app.use(morgan('dev')); // morgan to see all errors and dignosis

app.use(express.urlencoded({ extended: false })); // use the modle to convert to HTTP

app.use(methodOverride("_method")); // method-override morgan
app.use(morgan("dev")); // method-override morgan

/* ----------------------------------------------------------setup -------------------------------*/

// GET /
app.get("/", async (req, res) => {
  res.render("index.ejs");
});

// GET /fruits/new
app.get("/fruits/new", (req, res) => {
  res.render("fruits/new.ejs");
});

// GET /fruits/:id (this must be after new path)
app.get("/fruits/:fruitId", async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitId);
  res.render("fruits/show.ejs", { fruit: foundFruit });
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

// delete function
app.delete("/fruits/:fruitId", async (req, res) => {
  await Fruit.findByIdAndDelete(req.params.fruitId);
  res.redirect("/fruits");
});

// delete Item route
app.delete("/fruits/:fruitId", (req, res) => {
  res.send("This is the delete route");
});

// GET localhost:3000/fruits/:fruitId/edit
app.get("/fruits/:fruitId/edit", async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitId);
  //console.log(foundFruit);
  res.render("fruits/edit.ejs", {
    fruit: foundFruit,
  });
});

// update function
app.put("/fruits/:fruitId", async (req, res) => {
  // Handle the 'isReadyToEat' checkbox data
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  
  // Update the fruit in the database
  await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);

  // Redirect to the fruit's show page to see the updates
  res.redirect(`/fruits/${req.params.fruitId}`);
});

/* ---------------------------------------------------------- Path */





/* ----------------------------------------------TCP port */
app.listen(3000, () => {
  console.log('Listening on port 3000');
});