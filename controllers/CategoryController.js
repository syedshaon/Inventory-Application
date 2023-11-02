const Category = require('../models/category');
const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const { check, body, validationResult } = require("express-validator");
 

const CategoryController = {
  index: async (req, res) => {
    const categories = await Category.find();
    res.render("categories_list", { title: "Shop Categories", categories });
  },

    category_detail: async (req, res) => {
    const category = await Category.findById(req.params.id);
    res.render("category_detail", { title: category.name, category });
  },



  // Display Category create form on GET.
 category_create_get : async (req, res) => {
    res.render("category_create_form", { title: "Create new category" });
  },


// Handle Category create on POST.
  // category_create_post: async (req, res) => {
  //   const category = new Category({
  //     name: req.body.name,
  //     description: req.body.description,
  //   });

  //   await category.save();
  //   res.redirect("/categories");
  // },

  category_create_post : [
  // Validate the form data.
  check('name', 'Category name is required').notEmpty(),
  check('description', 'Category description is required').notEmpty(),

  // Process the request after validation.
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // The validation failed. Render the form again with the validation errors.
      res.render('error', {
        error: errors.array(),
        message:"Errors in submission"

      });
    } else {
      // The validation succeeded. Create the new category.
      const category = new Category({
        name: req.body.name,
        description: req.body.description,
      });

      await category.save();

      // Redirect to the category list page.
      res.redirect('/categories');
    }
  },
],






  // Display category update form on GET.
category_update_get : asyncHandler(async (req, res, next) => {
  // Get category and all genres for form.
 

  const category = await Category.findById(req.params.id);

  if (category === null) {
    // No results.
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

 

  res.render("category_update_form", {
    title: "Update Category",
    category: category,
  });
}),

// Process request after validation and sanitization.
category_update_post: asyncHandler(async (req, res, next) => {
  // Extract the validation errors from a request.
  
    const errors = validationResult(req);

  // Create a Category object with escaped/trimmed data and old id.

        const category = new Category({
        name: req.body.name,
        description: req.body.description,
        _id: req.params.id, // This is required, or a new ID will be assigned!
      });
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, category, {});
    // Redirect to category detail page.
    res.redirect(updatedCategory.url);
  
}),

  // Display category delete form on GET.
  category_delete_get : asyncHandler(async (req, res, next) => {
    // Get details of category and all its products (in parallel)
    const [category, allProductsByCategory] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Product.find({ category: req.params.id }, "name description").exec(),
    ]);

    if (category === null) {
      // No results.
      res.redirect("/catalog/categories");
    }

    res.render("category_delete", {
      title: "Delete Category",
      category: category,
      category_products: allProductsByCategory,
    });
  }),

  // Handle category delete on POST.
category_delete_post : asyncHandler(async (req, res, next) => {
  // Get details of category and all its products (in parallel)
  const [category, allProductsByCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Product.find({ category: req.params.id }, "name description").exec(),
  ]);

  if (allProductsByCategory.length > 0) {
    // Category has products. Render in same way as for GET route.
    res.render("category_delete", {
      title: "Delete Category",
      category: category,
      category_products: allProductsByCategory,
    });
    return;
  } else {
    // Category has no products. Delete object and redirect to the list of categories.
     if(req.body.answer == "earth"){
      await Category.findByIdAndRemove(req.body.categoryid);
        

      const categories = await Category.find();
    res.render("categories_list", { title: "Successfully deleted that Category", categories });



     }else{
        const categories = await Category.find();
    res.render("categories_list", { title: "X Category delete failed! X", categories });
     }
    
  }
})


};

module.exports = CategoryController;