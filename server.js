// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 7821;        // set our port

// database
var mongoose   = require('mongoose');
// connect to our database
mongoose.connect('mongodb://127.0.0.1:27017/PersonnalExpense', function(err) {
    if (err) {
        console.log('error : '+err);
    } else {
        console.log('Connected');
    }    
});

// models
var Expense = require('./app/modules/expense/expense.model.js');
var Category = require('./app/modules/category/category.model.js');

// ROUTES FOR OUR API
// =============================================================================
// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// on routes that end in /expenses
// ----------------------------------------------------
router.route('/expenses')
    // create a expense (accessed at POST http://localhost:8080/api/expenses)
    .post(function(req, res) {
        
        var expense = new Expense();      // create a new instance of the Expense model
        expense.name = req.body.name;  // set the expenses name (comes from the request)
        expense.amount = req.body.amount;
        expense.date = req.body.date;
        expense.category = req.body.category;

        // save the expense and check for errors
        expense.save(function(err) {
            if (err) {
                res.send(err);
                console.log(err);
            }
            res.json({ message: 'Expense created!' });
        });
    })
    // get all the expenses (accessed at GET http://localhost:8080/api/expenses)
    .get(function(req, res) {
        Expense.find(function(err, expenses) {
            if (err) {
                res.send(err);
            }

            res.json(expenses);
        });
    });
router.route('/expenses/:id')
    // remove expenses by Id
    .delete(function(req, res) {
        Expense.findByIdAndRemove(req.params.id, function(err, expenses) {
            if (err) {
                res.send(err);
            }

            res.json({ message: 'Expense removed!' });
        });
    });

// on routes that end in /expenses
// ----------------------------------------------------
router.route('/categories')
    // create a expense (accessed at POST http://localhost:8080/api/expenses)
    .post(function(req, res) {
        
        var category = new Category();      // create a new instance of the Expense model
        category.name = req.body.name;  // set the expenses name (comes from the request)

        // save the expense and check for errors
        category.save(function(err) {
            if (err) {
                res.send(err);
                console.log(err);
            }
            res.json({ message: 'Category created!' });
        });
    })
    // get all the expenses (accessed at GET http://localhost:8080/api/expenses)
    .get(function(req, res) {
        Category.find(function(err, categories) {
            if (err) {
                res.send(err);
            }

            res.json(categories);
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port, '127.0.0.1');