// app/modules/hash/hash.model.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TokenSchema   = new Schema({
     user: {type: Schema.Types.ObjectId, ref: 'User'},
     date: Date
});

module.exports = mongoose.model('Token', TokenSchema);