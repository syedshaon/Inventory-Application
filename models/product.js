const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Category = require('./category');

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category", 
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
  },
  // Make the url field virtual
  url: {
    type: String,
    virtual: true,
    get() {
      return `/product/${this.name}`;
    },
  },
});

module.exports = mongoose.model('Product', ProductSchema);
