// ProductController.js

const Product = require("../models/product");
 
const Category = require('../models/category');
const asyncHandler = require("express-async-handler");
const { check, body, validationResult } = require("express-validator");
 



const ProductController = {
  index: async (req, res) => {
    const products = await Product.find().populate("category").exec();
     const categories = await Category.find();

    const categoriesWithProducts = await Category.aggregate([ { $lookup: { from: "products", localField: "_id", foreignField: "category",as: "products",},},]);

     
    res.render("home", { title: "Shop Home", products , categories, categoriesWithProducts });
  },
  productList: async (req, res) => {
    const products = await Product.find().populate("category").exec();
    
     
    res.render("product_list", { title: "Product List", products  });
  },

    productDetails: async (req, res) => {
    //  console.log(req.params.id);
      const product = await Product.findById(req.params.id).populate("category").exec();
    //  res.send("hi");
     res.render("product_detail", { title: product.name, product });
  },

    // Display Category create form on GET.
 product_create_get : async (req, res) => {
    const categories = await Category.find();
    res.render("product_create_form", { title: "Create new product", categories });
  },


 
  // product_create_post: async (req, res) => {
  //   const product = new Product({
  //     name: req.body.name,
  //     description: req.body.description,
  //     category: req.body.category,
  //     price: Number(req.body.price),
  //     numberInStock: Number(req.body.numberInStock),
  //   });

  //   console.log(product);
  //     await product.save();
  //    res.redirect("/products");
  // },
  product_create_post : [
    
  // Validate the form data.
  check('name', 'Product name is required').notEmpty(),
  check('description', 'Product description is required').notEmpty(),
  check('category', 'Product category is required').notEmpty(),
  check('price', 'Product price is required').notEmpty(),
  check('numberInStock', 'Product number in stock is required').notEmpty(),
  //  check('productImage', 'Product image is required').notEmpty(),

  // Process the request after validation.
  async (req, res) => {
  
    const errors = validationResult(req);

    // Get the uploaded image file.
  // const productImage = req.body.file;

    if (!errors.isEmpty()) {
        console.log(errors);
      // The validation failed. Render the form again with the validation errors.
      res.render('error', {
        error: errors.array(),
        message:"Errors in submission"
      });
    } else {
      // The validation succeeded. Create the new product.
      const product = new Product({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        numberInStock: req.body.numberInStock,
        productImage:  req.file.path,
      });

      await product.save();

      // Redirect to the product list page.
      res.redirect('/products');
    }
  },
],

  // Display product update form on GET.
product_update_get : asyncHandler(async (req, res, next) => {
  // Get product_ and all genres for form.
 

  const product = await Product.findById(req.params.id).populate("category").exec();
  const categories = await Category.find();

  if (product === null) {
    // No results.
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

 

  res.render("product_update_form", {
    title: "Update Product",
    product: product,
    categories: categories
  });
}),


  product_update_post: async (req, res) => {
    if(!req.file){
       res.send("Wrong file type selected. Product update failed.")
    }else{
          const product = new Product({
        name : req.body.name,
        description: req.body.description,
        category : req.body.category,
        price : req.body.price,
        numberInStock : req.body.numberInStock,
        productImage: req.file.path,
        _id: req.params.id, // This is required, or a new ID will be assigned!
      });


     const updatedProduct = await Product.findByIdAndUpdate(req.params.id, product, {});
    // Redirect to Product detail page.
    res.redirect(updatedProduct.url);
    }
     
  },

    // Display category delete form on GET.
  product_delete_get : async (req, res) => {
    // Get details of category and all its products (in parallel)
    const product = await  Product.findById(req.params.id);

       res.render("product_delete", {
      title: "Delete Product",
      product: product
    });
  },


  product_delete_post: async (req, res) => {
    console.log(req.body.answer);
    if(req.body.answer == "earth"){
      const product = await Product.findById(req.params.id);
    await product.deleteOne();

    const products = await Product.find().populate("category").exec();   
     
    res.render("product_list", { title: "Successfully deleted that Product", products  });
        
    }else{
          const products = await Product.find().populate("category").exec();   
     
    res.render("product_list", { title: "X Product delete failed! X", products  });
       
    }
    
  },
  
};

module.exports = ProductController;
