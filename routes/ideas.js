var express = require("express");
var router = express.Router();
var mongoose = require('mongoose');
var {ensureAuthenticated} = require('../helpers/auth');

//models

require('../models/Ideas');
var Idea = mongoose.model('ideas');

// add ideas

router.get('/add', ensureAuthenticated, function(req, res){
	res.render('ideas/add',{
		title: 'Add Idea'
	});
})

router.post('/', ensureAuthenticated, function(req, res){
	
	var newIdea = {
		title: req.body.title,
		details: req.body.details,
		user: req.user.id
	}
	new Idea(newIdea)
		.save()
		.then(function(idea){
			req.flash('success_msg', 'video success');
			res.redirect('/ideas');
		})

})

//idea edit
router.get('/edit/:id', ensureAuthenticated, function(req, res){
	Idea.findOne({
		_id: req.params.id
	})
		.then(function(idea){
			if(idea.user != req.user.id){
				req.flash('error_msg','NOt');
				res.redirect('/ideas')
			}
			else{
				res.render('ideas/edit',{
					title: 'Edit Idea',
					idea: idea
				});
			}
		})
})

router.post('/:id', ensureAuthenticated, function(req, res){
	console.log(req.params.id);
	Idea.findOne({
		_id: req.params.id
	})
		.then(function(idea){
			idea.title = req.body.title;
			idea.details = req.body.details;

			idea.save()
				.then(function(idea){
					req.flash('success_msg', 'edit success');
					res.redirect('/ideas');
				})
		})
})

//view ideas


router.get('/', ensureAuthenticated, function(req, res){
	Idea.find({user: req.user.id})
		.sort({date: 'desc'})
		.then(function(ideas){
			res.render('ideas/index',{
				title: 'View Ideas',
				ideas: ideas
			});
		});
})

//delete ideas

router.get('/delete/:id', ensureAuthenticated, function(req, res){
	console.log(req.params.id);
	Idea.remove({
		_id: req.params.id
	})
		.then(function(){
			req.flash('success_msg', 'deleted success');
			res.redirect('/ideas');
		})
})




module.exports = router;