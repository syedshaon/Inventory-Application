const Category = require('../models/category');

class CategoryController {
  async getAllCategories(req, res) {
    const categories = await Category.find();
    res.json(categories);
  }

  async getCategoryById(req, res) {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).send('Category not found');
    }
    res.json(category);
  }

  async createCategory(req, res) {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  }

  async updateCategory(req, res) {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body);
    if (!category) {
      return res.status(404).send('Category not found');
    }
    res.json(category);
  }

  async deleteCategory(req, res) {
    await Category.findByIdAndDelete(req.params.id);
    res.status(204).send();
  }
}

module.exports = CategoryController;
