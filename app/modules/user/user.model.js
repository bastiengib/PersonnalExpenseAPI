// app/modules/user/user.model.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    salt: String
});

module.exports = mongoose.model('User', UserSchema);
