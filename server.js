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
var Template = require('./app/modules/template/template.model.js');

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
        expense.template = null;

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
    })
    // update expense
    .put(function(req, res) {
        var $set = {
            name:  req.body.name,  // set the expenses name (comes from the request)
            amount: req.body.amount,
            date: req.body.date,
            category: req.body.category
        };
        
        Expense.update({ _id: req.params.id}, {$set: $set}, function(err, expenses) {
            if (err) {
                res.send(err);
                console.log(err);
            }
            res.json({ message: 'Expense updated!' });
        });
    })
    // get expense by Id
    .get(function(req, res) {
        Expense.findById(req.params.id, function(err, expense) {
            if (err) {
                res.send(err);
            }

            res.json(expense);
        });
    });

// on routes that end in /templates
// ----------------------------------------------------
router.route('/templates')
    // create a template (accessed at POST http://localhost:8080/api/templates)
    .post(function(req, res) {
        
        var template = new Template();      // create a new instance of the Template model
        template.name = req.body.name;  // set the templates name (comes from the request)
        template.amount = req.body.amount;
        template.date = req.body.date;
        template.category = req.body.category;

        // save the template and check for errors
        template.save(function(err) {
            if (err) {
                res.send(err);
                console.log(err);
            }
            res.json({ message: 'Template created!' });
        });
    })
    // get all the templates (accessed at GET http://localhost:8080/api/templates)
    .get(function(req, res) {
        Template.find(function(err, templates) {
            if (err) {
                res.send(err);
            }

            res.json(templates);
        });
    });
router.route('/templates/:id')
    // remove templates by Id
    .delete(function(req, res) {
        Template.findByIdAndRemove(req.params.id, function(err, templates) {
            if (err) {
                res.send(err);
            }

            res.json({ message: 'Template removed!' });
        });
    })
    // update template
    .put(function(req, res) {
        var $set = {
            name:  req.body.name,  // set the templates name (comes from the request)
            amount: req.body.amount,
            date: req.body.date,
            category: req.body.category
        };
        
        Template.update({ _id: req.params.id}, {$set: $set}, function(err, templates) {
            if (err) {
                res.send(err);
                console.log(err);
            }
            res.json({ message: 'Template updated!' });
        });
    })
    // get template by Id
    .get(function(req, res) {
        Template.findById(req.params.id, function(err, template) {
            if (err) {
                res.send(err);
            }

            res.json(template);
        });
    });

// on routes that end in /expenses
// ----------------------------------------------------
router.route('/categories')
    // create a expense (accessed at POST http://localhost:8080/api/expenses)
    .post(function(req, res) {
        
        var category = new Category();      // create a new instance of the Template model
        category.name = req.body.name;
        category.color = req.body.color;  // set the expenses name (comes from the request)
        console.log(category.name);
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
router.route('/categories/:id')
    // remove expenses by Id
    .delete(function(req, res) {
        Category.findByIdAndRemove(req.params.id, function(err, categories) {
            if (err) {
                res.send(err);
            }

            res.json({ message: 'Category removed!' });
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port, '127.0.0.1');