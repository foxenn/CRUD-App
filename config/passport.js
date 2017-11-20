var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

require('../models/Users');
var User = mongoose.model('users');

module.exports = function(passport){
	passport.use(new LocalStrategy({usernameField: 'email'}, function(email, password, done){
		User.findOne({
			email: email
		}).then(function(user){
			if(!user){
				return done(null, false, {message: 'no user found'});
			}
			//match pass

			bcrypt.compare(password, user.password, function(err, isMatch){
				if (err) throw err;
				if(isMatch){
					return done(null, user);
				}
				else{
					return done(null, false, {message: 'password incorrect'});
				}
			})

		})
	}));

	passport.serializeUser(function(user, done) {
	  done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  User.findById(id, function(err, user) {
	    done(err, user);
	  });
	});
}