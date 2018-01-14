var list;
$(document).ready(function(){
  $.getJSON("/list.json", function(data){
    list = data.list;
    populate();
  });
});
function populate(){
  for(var i = 0; i < list.length; i++){
    var row = $("<tr></tr>");
    row.append("<td>" + list[i].name + "</td>");
    row.append("<td>" + list[i].score + "</td>");
    $("#cTable").append(row);
  }
}
