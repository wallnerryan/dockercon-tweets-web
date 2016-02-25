var express = require('express');
var MongoClient = require('mongodb').MongoClient;

// App
var app = express();

// Constants
var PORT = 8080;

//ntl engine
var fs = require('fs'); // this engine requires the fs module
app.engine('ntl', function (filePath, options, callback) { // define the template engine
  fs.readFile(filePath, function (err, content) {
    if (err) return callback(new Error(err));
    // this is an extremely simple template engine
    var rendered = content.toString().replace('#tweet#', '<style type="text/css"> body { background-color: #f3f3f3; }</style><div id="twt" style="display: inline-block; position: fixed; top: 0; bottom: 0; left: 0; right: 0; width: 500px; height: 200px; margin: auto; font-size:22pt; font-weight:bold; font-family: Helvetica Neue, sans-serif; letter-spacing: -1px; line-height: 1; background-color: #f3f3f3;"><p>'+ options.tweet +'</p></div>');
    return callback(null, rendered);
  })
});
app.set('views', './views'); // specify the views directory
app.set('view engine', 'ntl'); // register the template engine

app.get('/', function (req, res) {
    console.log('Contacting MongoDB');
    // Connect to the db
    MongoClient.connect("mongodb://"+process.env.MONGODB_SERVICE_SERVICE_HOST+":27017/test", function(err, db) {
      if(!err) {
        console.log("We are connected to MongoDB");
        db.collection('records', function(err, collection) {
		if (!err) {
		  collection.find().toArray(function(err, docs) {
                    if (!err) {
                      db.close();
                      len = docs.length-1;
                      //res.send(docs[len])
                      res.render('index', { tweet: docs[len].tweet});
                    }
		  });
		}
	});
      }
      else {
        res.send('Cannot connect to MongoDB\n');
        console.log("Cannot connect to MongoDB");
        console.log(err);
      }
    });
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
