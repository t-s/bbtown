var express = require("express");
var hbs = require('hbs');
var r = require('rethinkdb');
var exphbs = require('express-handlebars');
var app = express();
var router = express.Router();
var path = __dirname + '/views/';

handlebars = exphbs.create({
  extname:'.html'
})

app.engine('html', handlebars.engine);
app.set('view engine', 'html');

var config = require(__dirname+"/config.js");

var connection = null;

function get_problems() {
  r.connect({host: config.database.host, port: config.database.port}, function(err, conn) { 
    if (err) throw err;
    connection = conn;
  })
  .then(function(connection) {
    r.db('web').table('problems').run(connection, function(err, cursor) {
      cursor.each(function(err, row) {
        console.log(row);
      })
    })
  })
}
router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});

router.get("/about",function(req,res){
  res.sendFile(path + "about.html");
});

router.get("/contact",function(req,res){
  res.sendFile(path + "contact.html");
});

router.get("/problem_feed",function(req,res){
  res.sendFile(path + "problem_feed.html");
});

router.get("/example",function(req,res) {
  problem_list = []
  r.connect({host: config.database.host, port: config.database.port}, function(err, conn) {
    if (err) throw err;
      connection = conn;
  })
  .then(function(connection) {
    r.db('web').table('problems').run(connection, function(err, cursor) {
      problem_list = cursor.toArray(function(err, results) {
        if(err) {
            console.log(err);
        }
        else { 
          problem_list = JSON.stringify(results);
          console.log(problem_list);
          
          res.render('example_table', {problemList: problem_list});

        }
      })
      cursor.each(function(err, row) {
        //console.log(row);
      })
    })
  })
  //console.log(problem_list);
  //res.render('example_table', {problemList: problem_list});
  //res.sendFile(path + "example_table.html");
});

app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(3000,function(){
  console.log("Live at Port 3000");
});
