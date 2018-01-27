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
app.use(express.static(path.join(__dirname, 'client')));
app.use('/list.json', listR(db));
app.get('/', function(req, res, next){
  res.sendFile(path.join(__dirname, 'client/page.html'));
});
app.set('port', 8080);
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
