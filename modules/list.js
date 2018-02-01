var express = require('express');
var router = express.Router();

module.exports = function(db){
  function insert(data, res){
    db.query(
      "INSERT INTO scores (name, score, rank) " +
      "VALUES (?, ?, 0)",
      [data.person, data.score], function(err, result){
        rank2(result.insertId, data.score, res);
      });
  }
  function rank2(id, score, res){
    db.query(
      "SELECT COUNT(*) AS r FROM scores WHERE score > " + score + ";"
    , function(err, data){
      db.query(
        "UPDATE scores SET rank = rank + 1 WHERE score < " + score + ";"
      , function(){
        db.query(
          "UPDATE scores SET rank = " + (data[0].r + 1) + " WHERE id = " + id + ";"
        , function(){res.redirect('/scores?range=10&rank=' + data[0].r);});
      });
    });
  }
  function sendInfo(res, range, rank){
    db.query(
      "SELECT name, score, rank FROM scores WHERE rank BETWEEN "
       + rank + " AND " + (Number(rank)+ Number(range))
       + " ORDER BY rank;",
        function(err, rows){
         if(err)
          next(err);
         var data = {"list": rows};
         res.set('Content-Type', 'application/json');
         res.end(JSON.stringify(data));
    });
  }
  router.get('*', function(req, res, next){
    sendInfo(res, req.query.range, req.query.rank);
  });
  router.post('*', function(req, res, next){
    insert(req.body, res);
  });

  return router;
}
