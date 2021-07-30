const log4js = require('log4js');
const log4jsConfig = require('../config/log4js.json');
log4js.configure(log4jsConfig);
const loggerKoa2 = log4js.getLogger('koa2');
const loggerDefault = log4js.getLogger('default');
const loggerSystem = log4js.getLogger('system');
module.exports = {
    koaLogger(){
        return async (ctx, next) => {
            const start = Date.now();
            ctx.loggerKoa2 = loggerKoa2;
            ctx.loggerDefault = loggerDefault;
            ctx.loggerSystem = loggerSystem;
            ctx.log4js = log4js;
            await next();
            const end = Date.now();
            const responseTime = end - start;
            loggerKoa2.info(`响应时间为: ${(responseTime / 1000).toFixed(4)}s，请求 url : ${ctx.request.url}`);
        }
    },
    getLogger(){
        return log4js;
    }
}
