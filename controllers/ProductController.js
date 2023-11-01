// ProductController.js

const Product = require("../models/product");

const ProductController = {
  index: async (req, res) => {
    const products = await Product.find();
    res.render("product_list", { title: "Product List", products });
  },

  create: async (req, res) => {
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      numberInStock: req.body.numberInStock,
    });

    await product.save();
    res.redirect("/products");
  },

  show: async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render("product_detail", { title: product.name, product });
  },

  update: async (req, res) => {
    const product = await Product.findById(req.params.id);

    product.name = req.body.name;
    product.description = req.body.description;
    product.category = req.body.category;
    product.price = req.body.price;
    product.numberInStock = req.body.numberInStock;

    await product.save();
    res.redirect("/products/" + product._id);
  },

  delete: async (req, res) => {
    const product = await Product.findById(req.params.id);
    await product.deleteOne();
    res.redirect("/products");
  },
};

module.exports = ProductController;
