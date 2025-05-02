const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server is created");
});

//// database connected normal way
// mongoose
//   .connect("mongodb://127.0.0.1:27017/firstDB")
//   .then(() => console.log("database is connected"))
//   .catch(() => {
//     console.log("database is not connected");
//     console.error(error);
//   });

//!  product schema created
const productSchema = new mongoose.Schema({
  // schema with normal way
  // title: String,
  // price: Number,
  // place: String,

  //?schema with validation
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

//!  product model created
const product = mongoose.model("Products", productSchema);

//! database connected
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/firstDB");
    console.log("database is connected");
  } catch (error) {
    console.log("database is not connected");
    console.error(error);
  }
};

// product created
app.post("/product", async (req, res) => {
  try {
    const newProduct = new product({
      title: req.body.title,
      price: req.body.price,
      place: req.body.place,
    });
    const allProduct = await newProduct.save();
    res.send(allProduct);
  } catch (error) {
    res.send(error.message);
  }
});

app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);

  //?database call
  await connectDB();
});
