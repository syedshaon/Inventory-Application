// var express = require("express");
// var router = express.Router();

// /* GET home page. */
// router.get("/", function (req, res) {
//   res.redirect("/allproduct");
//   //  res.redirect("/catalog");
//   // res.send("hello");
// });

// module.exports = router;


var express = require("express");
var router = express.Router();
const path = require('path');


const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // cb(null, __dirname);
    // cb(null, path.join(__dirname, '/uploads/'));
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    // cb(null, new Date().toISOString() + file.originalname);
    cb(null, Date.now()+"~"+ file.originalname);
  }
});



const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 512
  },
  fileFilter: fileFilter
});

const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).send('File size exceeds the limit (512KB)');
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      // The file type is not supported.
     return res.status(400).send('The file type is not supported.');
    } 
    // Handle other Multer errors here, if needed
  } else {
    // An unknown error occurred
    console.error(err);
    return res.status(500).send('An error occurred while uploading the file');
  }
};

// Require controller modules.
const product_controller = require("../controllers/ProductController");
const category_controller = require("../controllers/CategoryController");

/// product ROUTES ///


router.get("/", product_controller.index);
// // GET request for list of all product items.
 router.get("/products", product_controller.productList);

 // GET request for one product.
router.get("/product/:id", product_controller.productDetails);


// GET request for creating a product. NOTE This must come before routes that display product (uses id).
router.get("/products/create", product_controller.product_create_get);

// POST request for creating product.
 router.post("/products/create", upload.single('productImage'),  errorHandler, product_controller.product_create_post);


 // GET request to delete product.
router.get("/product/:id/delete", product_controller.product_delete_get);


// POST request to delete product.
router.post("/product/:id/delete", product_controller.product_delete_post);

// GET request to update product.
router.get("/product/:id/update", product_controller.product_update_get);
// POST request to update product.
router.post("/product/:id/update", upload.single('productImage'), errorHandler, product_controller.product_update_post);

 
 


/// category ROUTES ///

// GET request for list of all categorys.
router.get("/categories", category_controller.index);
// GET request for one category.
router.get("/category/:id", category_controller.category_detail);

// GET request for creating category. NOTE This must come before route for id (i.e. display category).
 router.get("/categories/create", category_controller.category_create_get);

// POST request for creating category.
  router.post("/categories/create", category_controller.category_create_post);


// GET request to delete category.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete category.
router.post("/category/:id/delete", category_controller.category_delete_post);

// // GET request to update category.
 router.get("/category/:id/update", category_controller.category_update_get);

// // POST request to update category.
  router.post("/category/:id/update", category_controller.category_update_post);



module.exports = router;
