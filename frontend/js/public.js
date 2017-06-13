/**
 * Created by guoxu on 2/14/17.
 */

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    arr = document.cookie.match(reg);
    if( arr )
        return unescape(arr[2]);
    else
        return null;
}

// 判断是否登陆或者是否登陆超时
$(function () {
    window.admin = new Vue({
        el: '#admin',
        data: {
            show_admin: isAdmin
        }
    });
});

window.isAdmin = false;
// 判断是否登陆或者是否登陆超时
function isLogin() {
    var user_id = getCookie("user_id");
    if (user_id === null) {
        alert("Please log in first!");
        window.location.href = "/login";
        return;
    }
    var cur_path = window.location.pathname;
    var URL = '/api/login';
    $.ajax({
        type: "GET",
        url: URL,
        async: false,
        success: function (data) {
            var models = $.parseJSON(data);
            if (models.ok === false) {
                alert(models.info);
                window.location.href = "/login?" + cur_path;
            }
            else {
                var isAdmin = models.info['is_admin']
            }
        },
        error: function (xhr, error, exception) {
            alert(exception.toString());
        }
    });
}

// 判断是否登陆或者是否登陆超时
function isAdminLogin() {
    var user_id = getCookie("user_id");
    if (user_id === null) {
        alert("Please log in first!");
        window.location.href = "/admin";
        return;
    }
    var cur_path = window.location.pathname;
    var URL = '/api/login';
    $.ajax({
        type: "GET",
        url: URL,
        async: false,
        success: function (data) {
            var models = $.parseJSON(data);
            if (models.ok === false) {
                alert(models.info);
                window.location.href = "/admin" + cur_path;
            }
            else {
                var isAdmin = models.info['is_admin'];
                if(isAdmin === false){
                    alert("非管理员用户，请以管理员身份登陆");
                    window.location.href = "/admin";
                }
            }
        },
        error: function (xhr, error, exception) {
            alert(exception.toString());
        }
    });
}


// 自动填写html中的用户名
window.onload = function fillUsername() {
    var user_id = getCookie("user_id");
    document.getElementById("login_user").innerHTML = user_id;
};

//获取url中的参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null) {
        return unescape(r[2]);
    } else {
        return null;
    }
}

function showPage(curPage, totalPage, count, id_name) {
    if (count === null) {
        count = 10;
    }
    var i = 1;
    var item="";
    var href = "?page=";

    if (totalPage <= 2) {
        for (i; i <= totalPage; i++) {
            if (i == curPage) {
                item += "<a class='disabled item'>" + i + "</a>";
            }else {
                item += "<a class='item' href='" + href + i + "&count=" + count + "'>" + i + "</a>";
            }
        }
    } else if (totalPage > 2 && totalPage <= 5 ) {
        if ( curPage == 1 ) {
            item += "<a class='disabled icon item'><i class='left chevron icon'></i></a>";
        } else {
            item += "<a class='icon item' href='" + href + (curPage-1) + "&count=" + count + "'><i class='left chevron icon'></i></a>";
        }
        for (i; i <= totalPage; i++) {
            if (i == curPage) {
                item += "<a class='disabled item'>" + i + "</a>";
            }else {
                item += "<a class='item' href='" + href + i + "&count=" + count + "'>" + i + "</a>";
            }
        }
        if ( curPage == totalPage ) {
            item += "<a class='disabled icon item'><i class='right chevron icon'></i></a>";
        } else {
            item += "<a class='icon item' href='" + href + (curPage+1) + "&count=" + count + "'><i class='right chevron icon'></i></a>";
        }
    } else if (totalPage > 5) {
        if ( curPage == 1 ) {
            item += "<a class='disabled icon item'><i class='left chevron icon'></i></a>";
        } else {
            item += "<a class='icon item' href='" + href + (curPage-1) + "&count=" + count + "'><i class='left chevron icon'></i></a>";
        }
        if (curPage < 4) {
            for (i; i <= 4; i++) {
                if (i == curPage) {
                    item += "<a class='disabled item'>" + i + "</a>";
                }else {
                    item += "<a class='item' href='" + href + i + "&count=" + count + "'>" + i + "</a>";
                }
            }
            item += "<div class='disabled item'>...</div>";
            item += "<a class='item' href='" + href + totalPage + "&count=" + count + "'>" + totalPage + "</a>";
        }else if (curPage >= 3) {
            for (i; i <= 2; i++) {
                item += "<a class='item' href='" + href + i + "&count=" + count + "'>" + i + "</a>";
            }
            item += "<div class='disabled item'>...</div>";
            if (curPage+1 == totalPage) {
                for (i = curPage - 1; i <= totalPage; i++) {
                    if (i == curPage) {
                        item += "<a class='disabled item'>" + i + "</a>";
                    } else {
                        item += "<a class='item' href='" + href + i + "&count=" + count + "'>" + i + "</a>";
                    }
                }
            } else if (curPage+2 == totalPage) {
                for (i = curPage; i <= totalPage; i++) {
                    if (i == curPage) {
                        item += "<a class='disabled item'>" + i + "</a>";
                    } else {
                        item += "<a class='item' href='" + href + i + "&count=" + count + "'>" + i + "</a>";
                    }
                }
            }else if (curPage == totalPage) {
                for(i = curPage-2; i <= totalPage; i++){
                    if (i == curPage) {
                        item += "<a class='disabled item'>" + i + "</a>";
                    } else {
                        item += "<a class='item' href='" + href + i + "&count=" + count + "'>" + i + "</a>";
                    }
                }
            }else{
                for(i = curPage-1; i <= curPage+1; i++){
                    if (i == curPage) {
                        item += "<a class='disabled item'>" + i + "</a>";
                    } else {
                        item += "<a class='item' href='" + href + i + "&count=" + count + "'>" + i + "</a>";
                    }
                }
                item += "<div class='disabled item'>...</div>";
                item += "<a class='item' href='" + href + totalPage + "&count=" + count + "'>" + totalPage + "</a>";
            }
        }
        if ( curPage == totalPage ) {
            item += "<a class='disabled icon item'><i class='right chevron icon'></i></a>";
        } else {
            item += "<a class='icon item' href='" + href + (curPage+1) + "&count=" + count + "'><i class='right chevron icon'></i></a>";
        }
    }
    $("#"+id_name).append(item);
    return;
}

Vue.filter('time', function (unix_time) {
    if (unix_time === 0 || unix_time === null) {
        return 0;
    }

    if (unix_time.toString().length === 10) {
        unix_time = unix_time * 1000;
    }
    var date = new Date(unix_time);
    var Y = date.getFullYear().toString() ;
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth() + 1) : date.getMonth() + 1).toString();
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()).toString();
    var h = date.getHours().toString() ;
    var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()).toString();
    var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds()).toString();
    return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
});