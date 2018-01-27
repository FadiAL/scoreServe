module.exports = function(db){
  return function(req, res, next){
    db.query("SELECT * FROM scores", function(err, rows){
        if(err)
          next(err);
        var data = {"list": rows};
        res.end(JSON.stringify(data));
      });
  }
}
