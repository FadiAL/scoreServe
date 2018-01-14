var fs = require("fs");
var http = require("http");
var path = require("path");
var qs = require("querystring");
var mime = require("mime");
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
var server = http.createServer(function(request, response){
  if(request.method === "POST"){
    var rBody;
    request.on("data", function(data){
      rBody+=data;
    });
    request.on("end", function(){
      console.log(rBody);
      var data = qs.parse(rBody);
      console.log("Obtained data:", data.undefinedperson, data.score);
      scores.list.push({name: data.undefinedperson, score: data.score});
    });
  }
  if(request.url.substr(1) == "list.json"){
    console.log("LIST REQUESTED");
    response.writeHead(200, {"Content-Type": mime.getType(request.url)});
    response.write(JSON.stringify(scores));
    response.end();
  }
  else if(request.url == "/")
    serveFile("./client/page.html", response);
  else{
    console.log("Serving:", "." + request.url);
    serveFile("." + request.url, response);
  }
});
server.listen(8989, function(){
  console.log("Server listening on port 8989");
});
function serveFile(filePath, response){
  fs.readFile(filePath, function(err, data){
    if(!err){
      console.log("FOUND:", filePath);
      response.writeHead(200, {"Content-Type": mime.getType(filePath)});
      response.write(data);
    }
    response.end();
  });
}
