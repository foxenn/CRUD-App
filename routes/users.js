var express = require("express");
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var passport = require('passport');

require('../models/Users');
var User = mongoose.model('users');

//login route

router.get('/login', function(req, res){
	res.render('users/login',{
		title: "Login"
	});
})


router.post('/login', function(req, res, next){
	passport.authenticate('local', {
		successRedirect: '/ideas',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next);
});

//register

router.get('/register', function(req, res){
	res.render('users/register', {
		title: 'register'
	});
})

router.post('/register', function(req, res){
	User.findOne({
		email: req.body.email
	})
		.then(function(user){
			if(user){
				req.flash('error_msg', 'email exist');
				res.redirect('/users/register');
			}
			else{
				var newUser = new User ({
					name: req.body.name,
					email: req.body.email,
					password: req.body.password
				})

				bcrypt.genSalt(10, function(err, salt){
					bcrypt.hash(newUser.password, salt, function(err, hash){
						if (err) throw err;
						newUser.password = hash;
						newUser.save()
							.then(function(user){
								req.flash('success_msg', "register success");
								res.redirect('/users/login');
							})
							.catch(function(err){
								console.log(err);
								return;
							});
					});
				})
			}
		})
})

//logout

router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_msg', 'logged out');
	res.redirect('/users/login');
})

module.exports = router;











