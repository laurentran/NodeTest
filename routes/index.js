var express = require('express');
var router = express.Router();
var unirest = require('unirest');
var parseString = require('xml2js').parseString;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET hello world page. */
router.get('/helloworld', function(req, res) {
  res.render('helloworld', { title: 'Hello, World!' });
});

/* GET cat page. */
router.get('/randomcat', function(req, res) {
    unirest.get("http://thecatapi.com/api/images/get?format=xml&results_per_page=1")
    .header("api_key", "MTY3ODQ")
    .header("size", "small")
    .end(function (result) {
        console.log(result.body);
        parseString(result.body, function(err, response) {
            console.log(response.response.data[0].images[0].image[0].url[0]);
            var url = response.response.data[0].images[0].image[0].url[0];
            res.render('randomcat', { title: 'Meow' , image: url  });
        });
    });
});

/* GET happiness page. */
router.get('/happiness', function(req, res) {
    unirest.get("https://andyreagan-hedonometer-v1.p.mashape.com/timeseries/?format=json&limit=1&offset=2540")
    .header("X-Mashape-Key", "upu3FSDULKmsheWQ4po7oQC4a6lcp1IgpM4jsnaln3QVhAYKSv")
    .header("Accept", "application/json")
    .end(function (result) {
        console.log(result.status, result.headers, result.body);
        res.render('happiness', { title: 'World Happiness', happiness: result.body.objects[0].happiness });
    });
});

/* GET Yoda page. */
router.get('/yoda', function(req, res) {
  res.render('yoda', { title: 'Yoda Speak' });
});

/* POST to Translate Service */
router.post('/translate', function(req, res) {
    var sentence = req.body.inputsentence;

    unirest.get("https://yoda.p.mashape.com/yoda?sentence=" + sentence)
    .header("X-Mashape-Key", "upu3FSDULKmsheWQ4po7oQC4a6lcp1IgpM4jsnaln3QVhAYKSv")
    .header("Accept", "text/plain")
    .end(function (result) {
        console.log(result.status, result.headers, result.body);
        res.render('yoda', { title: 'Yoda Speak', translation : result.body });
    });
});


/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("userlist");
            // And forward to success page
            res.redirect("userlist");
        }
    });
});

module.exports = router;
