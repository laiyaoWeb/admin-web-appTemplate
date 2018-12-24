
var base = ctx;

// 创建axios实例
var fetch = axios.create({
    baseURL: base, // api的base_url
    timeout: 600000,        // 请求超时时间
    headers: {
        'X-Requested-With' : 'XMLHttpRequest',
        'Content-Type': 'application/json;charset=UTF-8'
    }
});

// request拦截器
fetch.interceptors.request.use(function(config){

    // Do something before request is sent
    // if (store.getters.token) {
    //   config.headers['X-Token'] = store.getters.token; // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    // }
    console.log(config.url);
    config.url = config.url + "?timestamp=" + (new Date().getTime());
    var re_params = {};
    if (typeof config.params != 'undefined') {
        for (var o in config.params) {
            if (config.params[o] instanceof Array) {
                re_params[o] = config.params[o].join(',');
            } else if (config.params[o] !== '') {
                re_params[o] = config.params[o];
            }
        }
    }
// if (config.url.indexOf('/sys/login') === -1) {
//   const paramsStr = JSON.stringify(re_params);
//   const base64Params = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(paramsStr));
//   const crypto_key = store.getters.token || '';
//   const cryptoData = {
//     content: base64Params,
//     sign: CryptoJS.HmacMD5(base64Params, crypto_key).toString()
//   }
//   config.params = cryptoData;
// } else {
//   config.params = re_params;
// }
config.params = re_params;
return config;
}, function(error){
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
});

// respone拦截器
fetch.interceptors.response.use(function(response){
    //console.log(response)
    if (typeof response.data.httpCode == 'undefined') {
        // 服务器出现异常,提示
        return response;
    } else {
        var httpCode = parseInt(response.data.httpCode);
        if (httpCode === 200) {
            return response.data;
        } else if (httpCode === 500) {
            vm.$message({
                message: '系统走神了，请稍后访问',
                type: 'warning',
                duration: 5 * 1000
            });
            return Promise.reject(response.data.msg);
        }else if(httpCode === 303){
            vm.getCaptcha();
            vm.$message({
                message: response.data.data,
                type: 'warning',
                duration: 5 * 1000
            });
            return Promise.reject(response.data.msg);
        } else if(httpCode === 403){
            vm.$message({
                message: '当前访问的资源包含未经授权内容!',
                type: 'warning',
                duration: 5 * 1000
            });
            return Promise.reject(response.data.msg);
        } else if(httpCode === 401){//session超时提示
            vm.loading = false;
            vm.$confirm('登录已超时,是否要重新登录?', '提示', {
                type: 'warning'
            }).then(function(){
                location.href = ctx;
            }).catch(function(){
                location.href = ctx;
            });
            return Promise.reject(response.data.msg);
        }else{
            vm.$message({
                message: response.data.msg,
                type: 'warning',
                duration: 5 * 1000
            });
            return Promise.reject(response.data.msg);
        }
    }
    },
    // /**
    // * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
    // * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
    // */
    // const code = response.data.code;
    // // 50014:Token 过期了 50012:其他客户端登录了 50008:非法的token
    // if (code === 50008 || code === 50014 || code === 50012) {
    //   Message({
    //     message: res.message,
    //     type: 'error',
    //     duration: 5 * 1000
    //   });
    //   // 登出
    //   store.dispatch('FedLogOut').then(() => {
    //     router.push({ path: '/login' })
    //   });
    // } else {
    //   return response
    // }
    function(error){
        vm.$message({
            message: "请求服务器异常!",
            type: 'error',
            duration: 5 * 1000
        });
        return Promise.reject(error);
    }
);


