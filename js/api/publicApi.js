
var getMenuList = function(){
    return fetch({
        url: '/menu',
        method: 'get'
    });
}

var getContentTemplate = function(params) {// 获取模板
    return fetch({
        url: "./pages" + params.url,
        method: 'post'
    });
};

var getDataList = function(params) {// 获取table数据列表
    return fetch({
        url: params.url,
        method: 'post',
        data: params.data
    });
};



var departList = function(){// 获取部门列表
    return fetch({
        url: '/sys/dept/list',
        method: 'get'
    });
};

var menuAllList = function() {// 权限选择列表;
    return fetch({
        url: '/sys/menu/list',
        method: 'get'
    });
};

function updatePassword(params) {//修改密码
    return fetch({
        url: '/sys/user/password',
        method: 'put',
        data: params
    })
}

function logout() {
    return fetch({
        url: '/sys/logout',
        method: 'get'
    });
}