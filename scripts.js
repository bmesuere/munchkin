$(document).ready(function () {
    $(window).bind('resize', setImageHeight);
    setImageHeight();

    var users = [];
    var currentUser = {};
    var isEdit = false;
    userAdd();

    $(".js-bonus-min").tap(bonusMin);
    $(".js-bonus-plus").tap(bonusPlus);
    $(".js-level-min").tap(levelMin);
    $(".js-level-plus").tap(levelPlus);

    $(".js-name-edit").click(userEdit);
    $(".js-name-save").click(userSave);
    $(".js-name-input").bind('keypress', function (e) {
       if ( e.keyCode == 13 ) userSave();
     });

    $(".js-user-add").tap(userAdd);

    function bonusMin() {
        currentUser.bonus--;
        updateUser(currentUser);
    }
    function bonusPlus() {
        currentUser.bonus++;
        updateUser(currentUser);
    }
    function levelMin() {
        currentUser.level--;
        updateUser(currentUser);
    }
    function levelPlus() {
        currentUser.level++;
        updateUser(currentUser);
    }

    function userEdit() {
        isEdit = true;
        $(".js-name-input").val(currentUser.name);

        $("h1.name").addClass("hidden");
        $("h1.name-edit").removeClass("hidden");

        $(".js-name-input").focus();
    }
    function userSave() {
        isEdit = false;
        currentUser.name = $(".js-name-input").val();
        updateUser(currentUser);

        $("h1.name").removeClass("hidden");
        $("h1.name-edit").addClass("hidden");
    }
    function userAdd() {
        if (isEdit) {
            userSave();
        }
        newUser = {
            id : users.length,
            name : "Munchkin",
            level : 1,
            bonus : 0
        };
        users.push(newUser);
        currentUser = newUser;
        updateUser(currentUser);
        userEdit();
        $(".js-name-input").select();
    }

    function changeCurrentUser(userId) {
        if (isEdit) {
            userSave();
        }
        currentUser = getUserById(userId);
        updateUser(currentUser);
    }

    function deleteUser(userId, ask) {
        var user = getUserById(userId),
            confirmation = true,
            i = 0;
        if (ask) {
            confirmation = confirm("Delete " + user.name + "?");
        }
        if (confirmation) {
            while (users[i] !== user) i++;
            users.splice(i, 1);
            if (users.length === 0) {
                userAdd();
            }
            if (currentUser === user) {
                changeCurrentUser(users[0].id);
            }
            showUserList(users);
        }
    }

    function updateUser(user) {
        $(".js-name").html(user.name);
        $(".js-level").html(user.level);
        $(".js-bonus").html(user.bonus);
        $(".js-points").html(user.level + user.bonus);

        $(".js-bonus-min").prop("disabled", user.bonus <= 0);
        $(".js-level-min").prop("disabled", user.level <= 1);
        $(".js-plural-points").toggleClass("hidden", (user.level + user.bonus) === 1);

        showUserList(users);
    }

    function showUserList(userList) {
        var output = "";

        userList.sort(function (a, b) { return b.level - a.level; });
        userList.forEach(function (user) {
            output += "<tr data-id='" + user.id + "'";
            output += user === currentUser ? " class='self'" : "";
            output += ">"
            output += "<td>" + user.name + "</td>";
            output += "<td>" + user.level + "</td>";
            output += "<td>" + user.bonus + "</td>";
            output += "<td>" + (user.level + user.bonus) + "</td>";
            output += "</tr>";
        });
        $(".js-users").html(output);

        $(".js-users tr")
            .tap(function () { changeCurrentUser($(this).data("id")); })
            .taphold(function () { deleteUser($(this).data("id"), true); });

    }

    function getUserById(id) {
        return users.filter(function (user) { return user.id === id; })[0];
    }

    function setImageHeight() {
        $('.board').css("max-height", $(window).height() - 50);
    }

});
