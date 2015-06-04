$(document).ready(function () {
    $(window).bind('resize', setImageHeight);
    setImageHeight();

    var users = [];
    var currentUser = {};
    var isEdit = false;
    var userListRef = new Firebase('https://resplendent-inferno-4684.firebaseio.com//score');

    userListRef.on('child_added', function (userSnapshot) {
        handleUserAdded(userSnapshot);
    });
    userListRef.on('child_removed', function (userSnapshot) {
        handleUserRemoved(userSnapshot);
    });
    userListRef.on('child_changed', function (userSnapshot) {
        handleUserChanged(userSnapshot);
    });

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
            id : getRandomId(),
            name : "Munchkin",
            level : 1,
            bonus : 0
        };

        userListRef.child(newUser.id).set(newUser);

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
        showUserList(users);
    }

    function deleteUser(userId, ask) {
        var user = getUserById(userId),
            confirmation = true,
            i = 0;
        if (ask) {
            confirmation = confirm("Delete " + user.name + "?");
        }
        if (confirmation) {
            userListRef.child(user.id).remove();
        }
    }

    function updateUser(user) {
        userListRef.child(user.id).set(user);
        $(".js-name").html(user.name);
        $(".js-level").html(user.level);
        $(".js-bonus").html(user.bonus);
        $(".js-points").html(user.level + user.bonus);

        $(".js-bonus-min").prop("disabled", user.bonus <= 0);
        $(".js-level-min").prop("disabled", user.level <= 1);
        $(".js-plural-points").toggleClass("hidden", (user.level + user.bonus) === 1);
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

    function handleUserAdded(userSnapshot) {
        users.push(userSnapshot.val());
        showUserList(users);
        if (users.length === 1) {
            changeCurrentUser(users[0].id);
        }
    }
    function handleUserRemoved(userSnapshot) {
        var user = getUserById(userSnapshot.val().id);
        var i = 0;
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
    function handleUserChanged(userSnapshot) {
        var updatedUser = userSnapshot.val();
        var user = getUserById(updatedUser.id);
        user.name = updatedUser.name;
        user.level = updatedUser.level;
        user.bonus = updatedUser.bonus;
        if (currentUser.id === user.id) {
            updateUser(user);
        }
        showUserList(users);
    }

    function getUserById(id) {
        return users.filter(function (user) { return user.id === id; })[0];
    }

    function getRandomId() {
        return Math.floor((Math.random() * 1000000) + 1);
    }

    function setImageHeight() {
        $('.board').css("max-height", $(window).height() - 50);
    }

});
