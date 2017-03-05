// app/modules/template/template.model.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TemplateSchema   = new Schema({
    name: String,
    amount: {type: Number, min:0},
    category:{type: Schema.Types.ObjectId, ref: 'Category'},
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('Template', TemplateSchema);