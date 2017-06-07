/**
 * Created by guoxu on 12/7/16.
 */

var admin_login = function () {
    var jump_url = "/admin/user_list";
    var url_before_login = window.location.search.replace(new RegExp('^\\?', 'g'), '');
    if (url_before_login !== "") {
        jump_url = url_before_login;
    }
    var request = {
        username: $("#username").val(),
        password: $("#password").val()

    };
    var encoded;
    encoded = $.toJSON(request);
    var jsonStr = encoded;
    var URL = '/api/admin_login';
    $.ajax({
        url: URL,
        type: 'POST',
        data: jsonStr,
        dataType: 'json',
        contentType: 'application/json;charset=utf8',
        success: function (data) {
            var models = data;
            if (models.ok === true) {
                window.location.href = jump_url;
            } else {
                alert(models.info);
            }
        },
        error: function (xhr, error, exception) {
            alert(exception.toString());
        }
    });
};
