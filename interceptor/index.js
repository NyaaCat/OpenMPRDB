const IpInterceptor = require('./IpInterceptor');
module.exports = {
    //通过请求方法拦截
    routerMethodInterceptor: function () {
        return async (ctx, next) => {
            let interceptMethodList = ctx.commonConfig.interceptMethodList;
            let method = ctx.req.method;
            if(~interceptMethodList.indexOf(method)){
                try {
                    let req = ctx.req;
                    let request = ctx.request;
                    let ip = req.headers['x-forwarded-for'] ||
                        req.ip ||
                        req.connection.remoteAddress ||
                        req.socket.remoteAddress ||
                        req.connection.socket.remoteAddress || request.ip || '';
                    if (ip) {
                        ip = ip.replace('::ffff:', '')
                    }
                    let interceptor = IpInterceptor.getIpInterceptor(ip);
                    if (interceptor) {
                        throw 'requestsTooFrequently';
                    }
                    IpInterceptor.setIpInterceptor(ip,ctx);
                    return await next();
                } catch (e) {
                    let errorMsg = ctx.errorCode.getErrorMsg(e)
                    ctx.loggerKoa2.error('当前拦截器错误:', errorMsg);
                    let status = 401;
                    ctx.httpTools.httpResponse(ctx, {reason: errorMsg}, status);
                    return;
                }
            }
            return await next();
        }
    },

}
