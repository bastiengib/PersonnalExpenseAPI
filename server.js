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
var User = require('./app/modules/user/user.model.js');
var Token = require('./app/modules/token/token.model.js');

var crypto = require('crypto');


function isConnected ($token, $user, res, callback) {
    Token.findOne({'_id': $token, 'user': $user}, function(err, token) {
        if (err) {
            res.send(err);
        }
        if (!token) {
            res.status(401).send({message: "Who are you ? (-_-)"});
            //res.json({item: null});
        } else {
            callback();
        }
    });
}

// =============================================================================
// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, CONNECT");
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
        isConnected(req.query.token, req.query.user, res, function () {
           var expense = new Expense();      // create a new instance of the Expense model
            expense.name = req.body.name;  // set the expenses name (comes from the request)
            expense.amount = req.body.amount;
            expense.date = req.body.date;
            expense.category = req.body.category;
            expense.template = null;
            expense.owner = req.query.user;

            // save the expense and check for errors
            expense.save(function(err, expense) {
                if (err) {
                    res.send(err);
                    console.log(err);
                }
                //res.json({ message: 'Expense created!' });
                var result = {
                    _id: expense.id,
                    name: expense.name,
                    amount: expense.amount,
                    date: expense.date,
                    category: expense.category
                };
                res.json({item: result});
            }); 
        });
    })
    // get all the expenses (accessed at GET http://localhost:8080/api/expenses)
    .get(function(req, res) {
        isConnected(req.query.token, req.query.user, res, function () {
            var skip = parseInt(req.query.o);
            var limit = parseInt(req.query.l);
            var sort= {
                date: parseInt(req.query.s)
            };
            /*Expense.find({"owner": req.query.user}, {}, {}, function(err, expenses) {
                if (err) {
                    res.send(err);
                }
                Expense.count({"owner": req.query.user}, function(err, count){
                    if (err) {
                        res.send(err);
                    }
                    res.json({ 'expenses': expenses, 'count':  count});
                });
            });*/
            Expense.find({owner: req.query.user}).sort({date: sort.date}).skip(skip).limit(limit).exec(function (err, expenses){
                if (err) {
                    res.send(err);
                }
                Expense.count({"owner": req.query.user}, function(err, count){
                    if (err) {
                        res.send(err);
                    }
                    res.json({ 'expenses': expenses, 'count':  count});
                });
            });
        });
    });
router.route('/expenses/:id')
    // remove expenses by Id
    .delete(function(req, res) {
        isConnected(req.query.token, req.query.user, res, function () {
            Expense.findByIdAndRemove(req.params.id, function(err, expenses) {
                if (err) {
                    res.send(err);
                }

                res.json({ message: 'Expense removed!' });
            });
        });
    })
    // update expense
    .put(function(req, res) {
        isConnected(req.query.token, req.query.user, res, function () {
            var $set = {
                name:  req.body.name,  // set the expenses name (comes from the request)
                amount: req.body.amount,
                date: req.body.date,
                category: req.body.category
            };
            
            Expense.update({ _id: req.params.id, "owner": req.query.user}, {$set: $set}, function(err, expenses) {
                if (err) {
                    res.send(err);
                    console.log(err);
                }
                res.json({ message: 'Expense updated!' });
            });
        });
    })
    // get expense by Id
    .get(function(req, res) {
        isConnected(req.query.token, req.query.user, res, function () {
            Expense.findOne({"_id": req.params.id, "owner": req.query.user}, function(err, expense) {
                if (err) {
                    res.send(err);
                }

                res.json(expense);
            });
        });
    });

// on routes that end in /templates
// ----------------------------------------------------
router.route('/templates')
    // create a template (accessed at POST http://localhost:8080/api/templates)
    .post(function(req, res) {
        isConnected(req.query.token, req.query.user, res, function () {
            var template = new Template();      // create a new instance of the Template model
            template.name = req.body.name;  // set the templates name (comes from the request)
            template.amount = req.body.amount;
            template.date = req.body.date;
            template.category = req.body.category;
            template.owner = req.query.user

            // save the template and check for errors
            template.save(function(err, template) {
                if (err) {
                    res.send(err);
                    console.log(err);
                }
                var result = {
                    _id: template.id,
                    name: template.name,
                    amount: template.amount,
                    category: template.category
                };
                res.json({item: result});
            });
        });
    })
    // get all the templates (accessed at GET http://localhost:8080/api/templates)
    .get(function(req, res) {
        isConnected(req.query.token, req.query.user, res, function () {
            Template.find({"owner": req.query.user}, function(err, templates) {
                if (err) {
                    res.send(err);
                }

                res.json(templates);
            });
        });
    });

router.route('/templates/:id')
    // remove templates by Id
    .delete(function(req, res) {
        isConnected(req.query.token, req.query.user, res, function () {
            Template.findById(req.params.id, function(err, template) {
                if (err) {
                    res.send(err);
                }
                if (template._id) {
                    Expense.findOne({'template': template._id}, function(err, expense){
                        if (err) {
                            res.send(err);
                        }
                        if (!expense) {
                            Template.remove({'_id': req.params.id}, function(err,removed) {
                                if (err) {
                                    res.send(err);
                                } else {
                                    res.json({ message: 'Category succesfully removed!' });
                                }
                            });
                        } else {
                            res.status(403).json({ message: 'Please remove all connected expenses to this template' });
                        }
                    });
                } else {
                    res.json({ message: 'This template is not referenced in our data!' });
                }
            });
        });
    })
    // update template
    .put(function(req, res) {
        isConnected(req.query.token, req.query.user, res, function () {
            var $set = {
                name:  req.body.name,  // set the templates name (comes from the request)
                amount: req.body.amount,
                date: req.body.date,
                category: req.body.category
            };
            
            Template.update({ _id: req.params.id, "owner": req.query.user}, {$set: $set}, function(err, templates) {
                if (err) {
                    res.send(err);
                    console.log(err);
                }
                res.json({ message: 'Template updated!' });
            });
        });
    })
    // get template by Id
    .get(function(req, res) {
        isConnected(req.query.token, req.query.user, res, function () {
            Template.findOne({"_id": req.params.id, "owner": req.query.user}, function(err, template) {
                if (err) {
                    res.send(err);
                }

                res.json(template);
            });
        });
    });

router.route('/templates/:id/apply')
    // apply the template
    .put(function(req, res) {
        isConnected(req.query.token, req.query.user, res, function () {
            Template.findOne({"_id": req.params.id, "owner": req.query.user}, function(err, template) {
                if (err) {
                    res.send(err);
                }

                var expense = new Expense();      // create a new instance from template
                expense.name = template.name;  
                expense.amount = template.amount;
                expense.date = req.body.date;
                expense.category = template.category;
                expense.template = req.body.id;
                expense.owner = req.query.user;

                // save the expense and check for errors
                expense.save(function(err, expense) {
                    if (err) {
                        res.send(err);
                        console.log(err);
                    }
                    //res.json({ message: 'Expense created!' });
                    var result = {
                        _id: expense._id,
                        name: expense.name,
                        amount: expense.amount,
                        date: expense.date,
                        category: expense.category,
                        template: expense.template
                    };
                    res.json({item: result});
                });
            });
        });
    });

// on routes that end in /expenses
// ----------------------------------------------------
router.route('/categories')
    // create a expense (accessed at POST http://localhost:8080/api/expenses)
    .post(function(req, res) {
        isConnected(req.query.token, req.query.user, res, function () {
            var category = new Category();      // create a new instance of the Template model
            category.name = req.body.name;
            category.color = req.body.color;  // set the expenses name (comes from the request)
            category.owner = req.query.user;
            // save the expense and check for errors
            category.save(function(err, cat) {
                if (err) {
                    res.send(err);
                    console.log(err);
                }
                var result = {
                    _id: cat.id,
                    name: cat.name,
                    color: cat.color
                };
                res.json({item: result});
            });
        });
    })
    // get all the expenses (accessed at GET http://localhost:8080/api/expenses)
    .get(function(req, res) {
        isConnected(req.query.token, req.query.user, res, function() {
            Category.find({"owner": req.query.user}, function(err, categories) {
                if (err) {
                    res.send(err);
                }

                res.json(categories);
            });
        });
    });
router.route('/categories/:id')
    // remove expenses by Id
    .delete(function(req, res) {
        isConnected(req.query.token, req.query.user, res, function () {
            Category.findById(req.params.id, function(err, category) {
                if (err) {
                    res.send(err);
                }
                if (category._id) {
                    Expense.findOne({'category': category._id}, function(err, expense){
                        if (err) {
                            res.send(err);
                        }
                        if (!expense) {
                            Template.findOne({'category': category._id}, function(err, template){
                                if (err) {
                                    res.send(err);
                                }
                                if (!template) {
                                    Category.remove({'_id': req.params.id}, function(err,removed) {
                                        if (err) {
                                            res.send(err);
                                        } else {
                                            res.json({ message: 'Category succesfully removed!' });
                                        }
                                    });
                                } else {
                                    res.status(403).json({ message: 'Please remove all connected templates to this category' });
                                }
                            });
                        } else {
                            res.status(403).json({ message: 'Please remove all connected expenses to this category' });
                        }
                    });
                } else {
                    res.json({ message: 'This category is not referenced in our data!' });
                }
            });
        });
    });

// on routes that end in /users
// ----------------------------------------------------
router.route('/users')
    // create a expense (accessed at POST http://localhost:8080/api/users)
    .post(function(req, res) {

        // hash password 

        var user = new User();      // create a new instance of the Template model

        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.username = req.body.username;

        //check if username already exists
        User.findOne({'username':user.username}, function(err, username) {
            if (err) {
                return res.send(err);
            } else if (username) {
                return res.status(403).send({message: "username already used!"});
            }

            var salt = crypto.randomBytes(16).toString('base64');
            user.password = crypto.createHmac('sha256', salt)
                .update(req.body.password).digest('base64');
            
            user.salt = salt;

            // save the expense and check for errors
            user.save(function(err, user) {
                if (err) {
                    res.send(err);
                    console.log(err);
                }
                var result = {
                    _id: user.id,
                    firstname : user.firstname,
                    lastname : user.lastname,
                    username : user.username,
                    password : user.password,
                    hash: user.salt
                };
                res.json({item: result});
            });
        });
    })
    .get(function(req, res) {
        isConnected(req.query.token, req.query.user, res,function () {
            res.json({'user': req.params.user});
        });
    });
router.route('/users/connect')
    .post(function(req, res) {
        var username = req.body.username;

        // hash password 
        User.findOne({username: username}, function(err, connected) {
            if (err) {
                res.send(err);
            }
            if (connected) {
                var password = crypto.createHmac('sha256', connected.salt)
                    .update(req.body.password).digest('base64');
                
                if (password === connected.password) {
                    var result = {
                        token: null,
                        _id: connected._id,
                        firstname: connected.firstname,
                        lastname: connected.lastname,
                        username: connected.username
                    };
                    // generate new connexion token
                    var token = new Token();
                    token.user = connected._id;
                    token.date = new Date();
                    token.save(function(err, newToken) {
                        if (err) {
                            res.send(err);
                        }
                        
                        result.token = newToken._id;
                        res.json({item: result});
                    });
                } else {
                    res.status(403).send({message: "Invalid credentials!"});
                }
            } else {
                res.status(403).send({message: "Invalid credentials!"});
            }
        });
    });
router.route('/users/disconnect')
    .post(function(req, res) {
        isConnected(req.body.token, req.body.user, res,function () {
            Token.findOneAndRemove({"_id": req.params.token, "owner": req.query.user}, function(err, token) {
                if (err) {
                    res.send(err);
                }
                 var result = {
                    token: null,
                    _id: null,
                    firstname: null,
                    lastname: null,
                    username: null
                };
                res.json({item: result});
            });
        });    
    });

router.route('/chart/permonth')
    .get(function(req, res) {
        var where = [
            {
                $project: {
                    "year": { $year : "$date" }, 
                    "month": { $month : "$date" },
                    "_id": "$_id",
                    "amount": "$amount",
                    "category": "$category",
                    "template": "$template",
                    "owner": "$owner"
                }
            },
            {
                $match: {
                    "owner": mongoose.Types.ObjectId(req.query.user),
                    "year": parseInt(req.query.y, 10),
                    "month": parseInt(req.query.m, 10)
                }
            },
            {
                $group: {
                    _id: '$category', 
                    count: {$sum: 1},
                    sum : {$sum: '$amount'}
                }
            }
        ];
        isConnected(req.query.token, req.query.user, res, function () {
            Expense.aggregate(where, function(err, data) {
                if (err) {
                    console.log(err.message);
                    res.send(err);
                }

                res.json(data);
            });
        });
    })

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port, '127.0.0.1');
