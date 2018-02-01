var page;
var pages;

$(document).ready(function(){
  page = Number($("input")[0].value);
  pages = Number(/\d+/g.exec($(".pageView")[0].innerText)[0]);
});
