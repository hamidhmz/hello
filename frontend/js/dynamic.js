// var socket = io();
const socket = io.connect();
$(document).ready(function () {
    socket.emit("a user is online", Cookies.get("token"));
    // socket.emit("a user is online",Cookies.get("token"));

    const userName = $("#userName");
    const nameForChange = $("#nameForChange");
    const userEmail = $("#userEmail");
    const logoutBtn = $("#logout");
    const emailForChange = $("#emailForChange");
    logoutBtn.click(function () {
        Cookies.remove("token");
        window.location.replace("/login");
    });
    if (!Cookies.get("token")) window.location.replace("/login");
    const contentType = "application/json; charset=utf-8";
    const dataType = "json";
    const type = "GET";
    const url = "/api/users/me";
    const header = { 'x-auth-token': Cookies.get("token") };
    $.ajax({
        url: url,
        type: type,
        contentType: contentType,
        dataType: dataType,
        headers: header,
        success: function (data, textStatus, response) {
            // if (response.getResponseHeader('x-auth-token')) {
            //     Cookies.set('token', response.getResponseHeader('x-auth-token'), {expires: 7});
            //     window.location.replace("http://localhost/index.html");
            // }
            userName.html(data.name);
            nameForChange.val(data.name);
            userEmail.html(data.email);
            emailForChange.val(data.email);

            Cookies.set("email", data.email);
        },
        error: function (xhr, status, error) {

            alert(error + xhr.responseText);

            // error1Label.html(error + " " + xhr.responseText);
        }
    });
    $.ajax({
        url: "/profile-image",
        type: type,
        contentType: 'Content-Type: text/html; charset=ISO-8859-15',
        dataType: 'html',
        async: false,
        crossDomain: 'true',
        success: function (data, textStatus, response) {
            // if (response.getResponseHeader('x-auth-token')) {
            //     Cookies.set('token', response.getResponseHeader('x-auth-token'), {expires: 7});
            //     window.location.replace("http://localhost/index.html");
            // }
            const img = $("#image_id");
            img.attr('src', 'data:image/jpg;base64,' + data);
            // img.attr('src', data);
        },
        error: function (xhr, status, error) {

            alert(error + xhr.responseText);

            // error1Label.html(error + " " + xhr.responseText);
        }
    });
    socket.on("load all users", function (data) {
        $("#users__buddies").html("");
        for (let i = 0; i < data.length; i++) {
            if (Cookies.get("email") === data[i].email) continue;
            $("#users__buddies").append("   <a href='/messages?email=" + data[i].email + "&name=" + data[i].name + "' class= \"listview__item " + (data[i].isOnline ? "chat__available" : "") + "\" >  <img src=\"profile-image/" + data[i].email + "\" class=\"listview__img\" > " +

                "        <div class=\"listview__content\"> " +
                "            <div class=\"listview__heading\">" + data[i].name + "</div> " +
                // "            <p>hey, how are you doing.</p> " +
                "        </div> </a> " +
                "    ");
        }
    });
});
