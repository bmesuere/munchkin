

$(document).ready(function() {
    $(window).bind('resize', setImageHeight);
    setImageHeight();

    var users = [];
    var currentUser = {id:0, name:"jos", level:1, bonus:2};
    showUser(currentUser);

    $(".js-bonus-min").click(bonusMin);
    $(".js-bonus-plus").click(bonusPlus);
    $(".js-level-min").click(levelMin);
    $(".js-level-plus").click(levelPlus);

    $(".js-name-edit").click(userEdit);
    $(".js-name-save").click(userSave);

    function bonusMin() {
        currentUser.bonus--;
        showUser(currentUser);
    }
    function bonusPlus() {
        currentUser.bonus++;
        showUser(currentUser);
    }
    function levelMin() {
        currentUser.level--;
        showUser(currentUser);
    }
    function levelPlus() {
        currentUser.level++;
        showUser(currentUser);
    }

    function userEdit() {
        $(".js-name-input").val(currentUser.name);

        $("h1.name").addClass("hidden");
        $("h1.name-edit").removeClass("hidden");
    }
    function userSave() {
        currentUser.name = $(".js-name-input").val();
        showUser(currentUser);

        $("h1.name").removeClass("hidden");
        $("h1.name-edit").addClass("hidden");
    }

    function showUser(user) {
        $(".js-name").html(user.name);
        $(".js-level").html(user.level);
        $(".js-bonus").html(user.bonus);
        $(".js-points").html(user.level + user.bonus);

        $(".js-bonus-min").prop("disabled", user.bonus <= 0);
        $(".js-level-min").prop("disabled", user.level <= 1);
    }

    function setImageHeight() {
        $('.board').css("max-height", $(window).height() - 50);
    }

});