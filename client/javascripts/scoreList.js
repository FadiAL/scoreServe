var list;
$(document).ready(function(){
  $.getJSON("/list.json", function(data){
    list = data.list;
    //sort();
    populate();
  });
});
function populate(){
  for(var i = 0; i < list.length; i++){
    var row = $("<tr></tr>");
    row.append("<td>" + list[i].rank + "</td>");
    row.append("<td>" + list[i].name + "</td>");
    row.append("<td>" + list[i].score + "</td>");
    $("#cTable").append(row);
  }
}
function sort(){
  list.sort(function(a, b){
    return b.score - a.score;
  });
}
