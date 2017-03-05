// app/modules/category/category.model.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CategorySchema   = new Schema({
    name: String,
    color: String,
    owner: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Category', CategorySchema);