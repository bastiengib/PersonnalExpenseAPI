// app/modules/hash/hash.model.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TokenSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('Token', TokenSchema);