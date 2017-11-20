var express = require("express");
var exphbs  = require('express-handlebars');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');

var app = express();

//passport config
require('./config/passport')(passport);

var db = require('./config/database');

// mongoose connect
mongoose.Promise = global.Promise;

mongoose.connect(db.mongoURI,{
	useMongoClient: true
})
	.then(function(){console.log('mongo connected')})
	.catch(function(err){console.log(err)});

// middlewares

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({
	secret: 'vsdcsdcb%^&^^hbhvb',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//global vars

app.use(function(req, res, next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
})

// basic route

app.get('/', function(req, res){
	res.render('index',{
		title: 'main'
	});
})

app.get('/about', function(req, res){
	res.render('about',{
		title: 'about'
	});
})

//routes for ideas

var ideas = require('./routes/ideas');
app.use('/ideas', ideas);

//routes for ideas

var users = require('./routes/users');
app.use('/users', users);

var port = process.env.PORT || 8080;

app.listen(port, function(){
	console.log("I'm listening on port " + port);
})












