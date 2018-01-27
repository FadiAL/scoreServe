var express = require('express');
var router = express.Router();

module.exports = function(db){
  function insert(data){
    db.query(
      "INSERT INTO scores (name, score, rank) " +
      "VALUES (?, ?, 0)",
      [data.person, data.score], function(err, result){
        rank2(result.insertId, data.score);
      });
  }
  function rank2(id, score){
    db.query(
      "SELECT COUNT(*) AS r FROM scores WHERE score > " + score + ";"
    , function(err, data){
      db.query(
        "UPDATE scores SET rank = rank + 1 WHERE score < " + score + ";"
      , function(){
        db.query(
          "UPDATE scores SET rank = " + (data[0].r + 1) + " WHERE id = " + id + ";"
        );
      });
    });
  }
  function sendInfo(res){
    db.query("SELECT * FROM scores", function(err, rows){
      if(err)
      next(err);
      var data = {"list": rows};
      res.end(JSON.stringify(data));
    });
  }
  router.get('*', function(req, res, next){
    sendInfo(res);
  });
  router.post('*', function(req, res, next){
    insert(req.body);
    res.redirect('/');
  });

  return router;
}
