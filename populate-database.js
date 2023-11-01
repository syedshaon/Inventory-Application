 

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Product = require('./models/product');
const Category = require('./models/category');

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];



const categories = []; 
const products = [];


main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
//   await createCategories(); 
  await createProducts(); 
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(index, name, description) {
  const category = new Category({ name: name , description: description});
  await category.save();
  category[index] = category;
  console.log(`Added category: ${name}`);
}


async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(0,   'Electronics',  'A category for electronic devices.' ),
    categoryCreate(1,   'Books',  'A category for books.' ),
    categoryCreate(2,   'Clothing',  'A category for clothing.' ),
  ]);
}


async function productCreate(index, name, description, categoryName, price, numberInStock) {
  const category = await Category.findOne({ name: categoryName });

  const productdetail = {
    name: name,
    description: description,
    category: category._id,
    price: price,
    numberInStock: numberInStock,
  };

  if (category !== false) {
    productdetail.category = category._id;
  }

  const product = new Product(productdetail);
  product.category = productdetail.category;
  await product.save();
  products[index] = product;
  console.log(`Added product: ${name}`);
}



async function createProducts() {
  console.log("Adding products");
  await Promise.all([
  productCreate(3, 'MacBook Air', 'The latest MacBook Air from Apple.', 'Electronics', 899, 50),
productCreate(4, 'iPad Pro', 'The latest iPad Pro from Apple.', 'Electronics', 799, 25),
productCreate(5, 'AirPods Pro', 'The latest AirPods Pro from Apple.', 'Electronics', 199, 100),

productCreate(6, 'Samsung Galaxy S22 Ultra', 'The latest Samsung Galaxy S22 Ultra from Samsung.', 'Electronics', 1199, 75),
productCreate(7, 'Google Pixel 6 Pro', 'The latest Google Pixel 6 Pro from Google.', 'Electronics', 899, 100),
productCreate(8, 'Microsoft Surface Laptop Go 2', 'The latest Microsoft Surface Laptop Go 2 from Microsoft.', 'Electronics', 499, 50),

productCreate(9, 'The Lord of the Rings: The Fellowship of the Ring', 'The first book in The Lord of the Rings series by J.R.R. Tolkien.', 'Books', 15, 25),
productCreate(10, 'The Two Towers', 'The second book in The Lord of the Rings series by J.R.R. Tolkien.', 'Books', 15, 25),
productCreate(11, 'The Return of the King', 'The third book in The Lord of the Rings series by J.R.R. Tolkien.', 'Books', 15, 25),

productCreate(12, 'Dune', 'A science fiction novel by Frank Herbert.', 'Books', 15, 25),
productCreate(13, 'Foundation', 'A science fiction novel by Isaac Asimov.', 'Books', 15, 25),
productCreate(14, 'The Hitchhiker\'s Guide to the Galaxy', 'A science fiction comedy series by Douglas Adams.', 'Books', 15, 25),

productCreate(15, 'White T-shirt', 'A simple white T-shirt.', 'Clothing', 20, 100),
productCreate(16, 'Black T-shirt', 'A simple black T-shirt.', 'Clothing', 20, 100),
productCreate(17, 'Blue T-shirt', 'A simple blue T-shirt.', 'Clothing', 20, 100),

productCreate(18, 'Jeans', 'A pair of blue jeans.', 'Clothing', 50, 75),
productCreate(19, 'Shorts', 'A pair of black shorts.', 'Clothing', 30, 50),
productCreate(20, 'Hoodie', 'A gray hoodie.', 'Clothing', 40, 25),

productCreate(21, 'Coffee maker', 'A simple coffee maker.', 'Home & Kitchen', 30, 50),
productCreate(22, 'Toaster', 'A simple toaster.', 'Home & Kitchen', 20, 25),
productCreate(23, 'Microwave', 'A simple microwave.', 'Home & Kitchen', 50, 75),

productCreate(24, 'Vacuum cleaner', 'A simple vacuum cleaner.', 'Home & Kitchen', 100, 50),
productCreate(25, 'Iron', 'A simple iron.', 'Home & Kitchen', 20, 25),
productCreate(26, 'Washing machine', 'A simple washing machine.', 'Home & Kitchen', 200, 25),

productCreate(27, 'Board game', 'A simple board game.', 'Toys & Games', 20, 25),
productCreate(28, 'Building blocks', 'A set of building blocks.', 'Toys & Games', 30, 50),
productCreate(29, 'Action figure', 'A superhero action figure.', 'Toys & Games', 15, 25),

productCreate(30, 'Stuffed animal', 'A teddy bear stuffed animal.', 'Toys & Games', 20, 50),

    
   
  ]);
}


 