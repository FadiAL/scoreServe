var page;
var pages;
var range = 10;

$(document).ready(function(){
  page = Number($("input")[0].value);
  pages = Number(/\d+/g.exec($(".pageView")[0].innerText)[0]);
});

function moveLeft(){
  move(page-1);
}
function moveRight(){
  move(page+1);
}
function move(destPage){
  $.getJSON("/list.json?range=" + range + "&rank=" + destPage*range,
            function(data){
              $("#cTable").children().remove();
              for(var i = 0; i < data.list.length; i++){
                var elem = $("<tr></tr>");
                elem.append($("<td></td>").text(data.list[i].rank));
                elem.append($("<td></td>").text(data.list[i].name));
                elem.append($("<td></td>").text(data.list[i].score));
                $("#cTable").append(elem);
                updatePage(destPage);
              }
            }
  );
}
function updatePage(destPage){
  page = destPage;
  $("input")[0].value = page;
}
