var fs = require("fs");
var http = require("http");
var path = require("path");
var qs = require("querystring");
var mime = require("mime");

var rName = require("random-name");
var scores;

readSheet();
function readSheet(){
  fs.readFile("list.saved.json", function(err, data){
    if(err)
      fs.readFile("list.json", function(err, data){
        console.log("Saved list not found, loading list.json");
        if(err){
          console.log("list.json not found, creating empty list");
          populateRandom(100);
          console.log("Generated list");
          fs.writeFile("list.json", JSON.stringify(scores), function(err){
            if(err)
              console.log("Error: Could not save new file");
            else
              console.log("File saved as list.json");
          });
          return;
        }
        scores = JSON.parse(data);
      });
    else
      scores = JSON.parse(data);
  });
}

//SERVER METHODS

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
      fs.writeFile("list.saved.json", JSON.stringify(scores), function(err){
        console.log("ERROR SAVING FILE");
      });
    });
  }
  if(request.url.substr(1) == "list.json"){
    console.log("LIST REQUESTED");
    var body = JSON.stringify(scores);
    response.setHeader("Content-Length", Buffer.byteLength(body));
    response.writeHead(200, {"Content-Type": mime.getType(request.url)});
    response.write(body);
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
  fs.stat(filePath, function(err, stats){
    if(err){
      if(err.code == "ENOENT")
        throwNotFoundError(response);
      else
        throwInternalError(response);
    }
    else{
      response.setHeader("Content-Type", mime.getType(filePath));
      response.setHeader("Content-Length", stats.size);
      var stream = fs.createReadStream(filePath);
      stream.pipe(response);
      stream.on("error", function(err){
        throwInternalError(response);
      });
    }
  });
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

//HELPER FUNCTIONS
function populateRandom(num){
  scores = {};
  scores.list = [];
  for(var i = 0; i < num; i++){
    scores.list.push({name: rName(), score: randomNum(0, 10000)});
  }
}
function randomNum(min, max){
  return Math.floor(Math.random()*(max-min)) + min;
}
