const Product = require("./../models/productModel");
require("dotenv").config({ path: "server/config/config.env" });
const connectDatabase = require("./../config/database");

const productsData = require("./../data/productsData.json");
const { connect } = require("mongoose");

connectDatabase();

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log("Products are deleted!");
    await Product.insertMany(productsData);
    console.log("All products are added");
    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seedProducts();
