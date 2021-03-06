module.exports = function(auth, options){

	var request = require('request');

	var options = options['a2']["config"];

	var express = require('express'),
    router = express.Router();

	router.get('/', auth, function(req, res, next) {
		res.redirect('users/teacherview');
	});

	/* GET login page */
	router.get('/login', function(req, res, next) {
		res.render('login_material', { title: 'Acceso profesor' });
	});

	router.get('/logout', function(req, res, next){
		req.session.user = null;
		res.redirect('login');
	})

	/* GET register page */
	router.get('/register', function(req, res, next) {
		res.render('register', { title: 'Registro profesor'});
	});

	/* GET userlist page */
	router.get('/userlist', auth, function(req, res) {
		var db = req.db;
		var collection = db.get('usercollection');
		collection.find({},{},function(e,docs){
			res.render('userlist', {"userlist" : docs });
		});
	});

	/* GET teacher view page */
	router.get('/teacherview', auth, function(req, res, next) {
		var db = req.db;
		var classcollection = db.get('classcollection');

		classcollection.find({"user": req.session.user._id}, function(err,docs) {
			if (err) clases = 0;
			else clases = docs.length;
			res.render('home', {username : req.session.user.username, clases: clases});
		});
	});

	/* POST to register new teacher */
	router.post('/register', function(req, res) {

		// Set our internal DB variable
		var db = req.db;

		// Get our form values. These rely on the "name" attributes
		userName = req.body.username;
		var userEmail = req.body.mail;
		var userPass = req.body.pass;

		// Check repeated passwords match
		if (userPass != req.body.pass2) {
			res.send("Error. Passwords do not match.");
			return;
		}

		// Set our collection
		var collection = db.get('usercollection');

		collection.find({ $or: [ {"username": userName}, {"email": userEmail} ]}, function(err,docs) {
			if (err) res.send(err);
			if (docs.length > 0) {
				// Username or email already exists
				res.send("Error. User already exists.");
			}
			else {
				// Submit to the DB
				collection.insert({
					"username" : userName,
					"email" : userEmail,
					"pass": userPass
				}, function (err, doc) {
					if (err) {
						// If it failed, return error
						res.send("There was a problem adding the information to the database.");
					}
					else {
						req.session.user = doc;
						// Forward to success page
						res.redirect('teacherview');
					}
				});
			} 
		});

	});

	/* POST to login teacher */
	router.post('/login', function(req, res) {

		/*// Set our internal DB variable
		//var db = req.db;

		// Get our form values. These rely on the "name" attributes
		var userName = req.body.username;
		var userPass = req.body.pass;

		// Set our collection
		var collection = db.get('usercollection');

		collection.find({"username": userName}, function(err,docs) {
		   if (err) res.send(err);
		   if (docs.length > 0) {
			    // Username exists
			    if (docs[0].pass == userPass) {
					req.session.user = docs[0];
				    res.redirect('teacherview');
			    }
			    else {
			        res.send("Error. Contraseña incorrecta.");
			    }
		   }
		   else {
			   res.send("Error. El usuario no existe.")
		   } 
		});*/

		this.options = cloneOptions();

		this.options.url += "login";
		this.options.method = "POST";
		this.options.body = JSON.stringify({username: req.body.username, password: req.body.pass});

		request(this.options, function(error, response, body){
			if (!error && response.statusCode == 200) {
				req.session.user = JSON.parse(body).user;
				res.redirect('teacherview');
			}else
				res.send("Login error: " + error);
		})
	});

	function cloneOptions(){
		return JSON.parse(JSON.stringify(options));
	}

	return router;
}