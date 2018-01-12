var fs = require("fs");
var http = require("http");
var path = require("path");
var scores;

fs.exists("list.json", function(exists){
  if(exists)
    readSheet();
});
function readSheet(){
  fs.readFile("list.json", function(err, data){
    if(err)
      console.log("PANIC");
    else
      scores = JSON.parse(data);
  });
}
