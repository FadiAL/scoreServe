var http = require("http");
var path = require("path");

var express = require("express");
var log = require('morgan');
var bodyParser = require('body-parser');

var mysql = require("mysql");
var cfg = require("./config.json");
var scores;

var listR = require(path.join(__dirname, 'modules/list.js'));
var app = express();
var db;

createTable();

//SERVER METHODS

app.use(log('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use('/list.json', listR(db));
app.get('/', function(req, res, next){
  res.sendFile(path.join(__dirname, 'client/page.html'));
});
app.use(express.static(path.join(__dirname, 'client')));
app.get('/scores', function(req, res, next){
  var str = ''+req.query.rank;
  var num = str.slice(0, str.length-1) + '0';
  var range = req.query.range;
  db.query(
    "SELECT name, score, rank FROM scores WHERE rank BETWEEN "
     + num + " AND " + (Number(num)+ Number(range))
     + " ORDER BY rank;"
  , function(err, data){
    db.query(
      "show table status;", function(err, stats){
        var pages = Math.floor(Number(stats[1].Rows)/Number(range));
        var curPage = Math.floor(Number(num)/Number(range));
        res.render('scoreView', {scores: data, pages: pages, curPage: curPage});
      }
    );
  });
});

app.set('port', 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var server = http.createServer(app);
server.listen(8080);

//HELPER FUNCTIONS

function createTable(){
  db = mysql.createConnection({
    host: cfg.host,
    user: cfg.username,
    password: cfg.password,
    database: cfg.database
  });

  db.query(
    "CREATE TABLE IF NOT EXISTS scores("
    + "id INT(10) NOT NULL AUTO_INCREMENT, "
    + "name varchar(30), "
    + "score INT(6), "
    + "rank INT(4), "
    + "PRIMARY KEY(id));",
    function(err){
      if(err){
        console.log("Could not create database table, is mySQL properly set up?", err);
        return;
      }
      console.log("Database table scores created");
    }
  );
}

//SERVER ERRORS

function throwInternalError(response){
  response.statusCode = 500;
  response.end("Internal Server Error");
}
function throwNotFoundError(response){
  response.statusCode = 404;
  response.end("File Not Found");
}
