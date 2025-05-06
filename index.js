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
const Product = mongoose.model("Products", productSchema);

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

// products created
app.post("/products", async (req, res) => {
  try {
    const newProduct = new Product({
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

// products get
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    // const products = await Product.find().limit(3);
    // const products = await Product.find().sort({ price: 1 });

    //! some query
    // const products = await Product.find().countDocuments();

    // comparison query
    // const products = await Product.find({ price: { $lt: 50000 } });
    // const products = await Product.find({ price: { $in: [50000, 300, 400] } });

    // parameter query
    // const price = req.query.price;
    // const products = await Product.find({ price: { $gt: price } });

    // logical query
    // const products = await Product.find({
    //   $and: [{ price: { $lt: 50000 } }, { place: { $eq: "dhaka" } }],
    // });

    if (products) {
      res.send(products);
    } else {
      res.send("No Products in the list");
    }
  } catch (error) {
    res.send(error.message);
  }
});

// product get by id
app.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // const products = await Product.find({ _id: id });

    const products = await Product.findOne({ _id: id });

    // const products = await Product
    //   .findOne({ _id: id })
    //   .select({ title: 1, price: 1, _id: 0 });

    // const products = await Product.findOne({ _id: id }, { title: 1, _id: 0 });

    if (products) {
      res.send(products);
    } else {
      res.send("Product not in the list");
    }
  } catch (error) {
    res.send(error.message);
  }
});

// products delete by id
app.delete("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleteProduct = await Product.deleteOne({ _id: id });
    if (deleteProduct) {
      res.send({
        message: "Product is deleted",
        data: deleteProduct,
      });
    } else {
      res.send({ message: "Product is not in the list" });
    }
  } catch (error) {
    res.send(error.message);
  }
});

// products updated by id
app.put("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateProduct = await Product.updateOne(
      { _id: id },
      { $set: { price: 120000 } }
    );
    if (updateProduct) {
      res.send({
        message: "Product is updated",
        data: updateProduct,
      });
    } else {
      res.send({ message: "Product is not updated" });
    }
  } catch (error) {
    res.send(error.message);
  }
});

app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);

  //?database call
  await connectDB();
});
