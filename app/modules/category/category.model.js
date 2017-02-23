// app/modules/category/category.model.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CategorySchema   = new Schema({
    name: String,
    color: String
});

module.exports = mongoose.model('Category', CategorySchema);