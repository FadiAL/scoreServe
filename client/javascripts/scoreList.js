var page;
var pages;
var range = 10;

$(document).ready(function(){
  page = Number($("input")[0].value);
  updatePage(page);
  pages = Number(/\d+/g.exec($(".pageView")[0].innerText)[0]);
  setArrows();
  $("#input").submit(function(event){
    destPage = Number($("input")[0].value)-1;
    event.preventDefault();
    if(destPage >= pages)
      destPage = pages-1;
    if(destPage < 0)
      destPage = 0;
    move(destPage);
  });
});

function moveLeft(){
  if($('#left-arrow').attr('src').indexOf('active') > 0)
    move(page-1);
}
function moveRight(){
  if($('#right-arrow').attr('src').indexOf('active') > 0)
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
  $("input")[0].value = page+1;
  setArrows();
}
function setArrows(){
  if(page > 0)
    $("#left-arrow").attr("src", "icons/arrow-left-active.png");
  else
    $("#left-arrow").attr("src", "icons/arrow-left.png");
  if(page < pages-1)
    $("#right-arrow").attr("src", "icons/arrow-right-active.png");
  else
    $("#right-arrow").attr("src", "icons/arrow-right.png");
}
