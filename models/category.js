const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  // Make the url field virtual
  url: {
    type: String,
    virtual: true,
    get() {
      return `/category/${this._id}`;
    },
  },
});

 

module.exports = mongoose.model('Category', CategorySchema);
