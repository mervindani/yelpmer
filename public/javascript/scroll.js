//Infinite Scroll
$(window).on("scroll", function () {
  //page height
  var scrollHeight = $(document).height();
  //scroll position
  var scrollPos = $(window).height() + $(window).scrollTop();
  // fire if the scroll position is 300 pixels above the bottom of the page
  if ((scrollHeight - 500 >= scrollPos) / scrollHeight == 0) {
    $(".load-more-days-button").click();
  }
});
