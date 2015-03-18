function setImageHeight() {
    $('.board').css("max-height", $(window).height() - 50);
}

$(document).ready(function() {
    $(window).bind('resize', setImageHeight);
    setImageHeight();
});