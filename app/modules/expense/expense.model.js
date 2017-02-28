// app/modules/expense/expense.model.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ExpenseSchema   = new Schema({
    name: String,
    amount: {type: Number, min:0},
    date: Date,
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    template: {type: Schema.Types.ObjectId, ref: 'Template'}
});

module.exports = mongoose.model('Expense', ExpenseSchema);