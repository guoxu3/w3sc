/*jshint multistr: true */
/**
 * Created by guoxu on 12/7/16.
 */

$(function () {
    window.userinfo = new Vue({
        el: '#userinfo',
        data: {
            id: '',
            user_id: '',
            parent_id: '',
            type: '',
            create_time: '',
            expire_time: '',
            enabled: '',
            port: '',
            net_flow: '',
            remarks: ''
        }
    });

    window.normal_userlist = new Vue({
        el: '#normal_userlist',
        data: {
            page: '',
            user_list: [],
            show_button: false
        }
    });

    window.vip_userlist = new Vue({
        el: '#vip_userlist',
        data: {
            page: '',
            user_list: [],
            show_button: false
        }
    });
    window.try_userlist = new Vue({
        el: '#try_userlist',
        data: {
            page: '',
            user_list: [],
            show_button: false
        }
    });
});

function getUserData(callback, user_id) {
    var URL = '/api/user?user_id=' + user_id;
    $.ajax({
        type: "GET",
        url: URL,
        success: function (data) {
            var models = $.parseJSON(data);
            if (models.ok === true) {
                callback(null, models.info['data']);
            } else {
                callback(models.info, {});
            }
        },
        error: function (xhr, error, exception) {
            callback(exception.toString(), {});
        }
    });
}

function getUserByUserId(user_id) {
    if (user_id !== "") {
        getUserData(function (err, data) {
            if (err) {
                alert(err);
                return;
            }
            userinfo.$data.id = data['id'];
            userinfo.$data.user_id = data['user_id'];
            userinfo.$data.parent_id = data['parent_id'];
            userinfo.$data.type = data['type'];
            userinfo.$data.create_time = data['create_time'];
            userinfo.$data.expire_time = data['expire_time'];
            userinfo.$data.enabled = data['enabled'];
            userinfo.$data.port = data['port'];
            userinfo.$data.net_flow = data['net_flow'];
            userinfo.$data.remarks = data['remarks'];
        }, user_id);
    }
}

function getAllUserData(callback, id_type, id_name) {
    var cur_page = GetQueryString('page');
    var user_num = 10;
    var count = GetQueryString('count');
    if (cur_page === null || count === null) {
        cur_page = 1;
        count = 10;
    }
    var start = ((cur_page - 1) * count);
    var URL = '/api/user?id_type=' + id_type + '&start=' + start +'&count=' + count;
    $.ajax({
        type: "GET",
        url: URL,
        success: function (data) {
            var models = $.parseJSON(data);
            if (models.ok === true) {
                callback(null, models.info['data'], cur_page, true);
                user_num = models.info['count'];
            } else {
                callback(models.info, {}, cur_page, false);
            }
            showPage(cur_page, Math.ceil(user_num/count), count, id_name);
        },
        error: function (xhr, error, exception) {
            callback(exception.toString(), {}, cur_page, false);
        }
    });
}

function getAllNormalUser() {
    getAllUserData(function (err, data, page, show) {
        if (err){
            alert(err);
            return;
        }
        normal_userlist.$data.page = page;
        normal_userlist.$data.user_list = data;
        normal_userlist.$data.show_button = show;
    }, 'normal', 'normal_pages');
}

function getAllVipUser() {
    getAllUserData(function (err, data, page, show) {
        if (err){
            alert(err);
            return;
        }
        vip_userlist.$data.page = page;
        vip_userlist.$data.user_list = data;
        vip_userlist.$data.show_button = show;
    }, 'vip', 'vip_pages');
}

function getAllTryUser() {
    getAllUserData(function (err, data, page, show) {
        if (err){
            alert(err);
            return;
        }
        try_userlist.$data.page = page;
        try_userlist.$data.user_list = data;
        try_userlist.$data.show_button = show;
    }, 'try', 'try_pages');
}


function addUser() {
    var data = {
        user_type: $("#user_type").val(),
        expiry_mouth: $("#expiry_date").val(),
        remarks: $("#remarks").val()
    };
    var request = {
        action: 'add',
        data: data
    };
    var encoded;
    encoded = $.toJSON(request);
    var jsonStr = encoded;
    var URL = '/api/user';
    $.ajax({
        url: URL,
        type: 'POST',
        data: jsonStr,
        dataType: 'json',
        contentType: 'application/json;charset=utf8',
        success: function (data) {
            var models = data;
            if (models.ok === true) {
                alert(models.info);
                window.location.href = "/admin/user_list";
            } else {
                alert(models.info);
            }
        },
        error: function (xhr, error, exception) {
            alert(exception.toString());
        }
    });
}


function updateUserTime() {
    var user_id = $("#user_id").val();
    var add_mouth = $("#add_mouth").val();

    var data = {
        user_id: user_id,
        add_mouth: add_mouth
    };
    var request = {
        action: 'update_time',
        data: data
    };
    var encoded;
    encoded = $.toJSON(request);
    var jsonStr = encoded;
    var URL = '/api/user';
    $.ajax({
        url: URL,
        type: 'POST',
        data: jsonStr,
        dataType: 'json',
        contentType: 'application/json;charset=utf8',
        success: function (data) {
            var models = data;
            if (models.ok === true) {
                alert(models.info);
            } else {
                alert(models.info);
            }
        },
        error: function (xhr, error, exception) {
            alert(exception.toString());
        }
    });
}


function deleteUser(user_id) {
    var URL = '/api/user?user_id=' + user_id;
    $.ajax({
        type: "DELETE",
        url: URL,
        success: function (data) {
            var models = $.parseJSON(data);
            if (models.ok === true) {
                alert(models.info);
                location.reload()
            } else {
                alert(models.info);
            }
        },
        error: function (xhr, error, exception) {
            alert(exception.toString());
        }
    });
}



