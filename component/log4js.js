const log4js = require('log4js');
const log4jsConfig = require('../config/log4js.json');
module.exports = options => {
    return async (ctx, next) => {
        const start = Date.now();
        log4js.configure(log4jsConfig);
        ctx.log4js = log4js;
        const logger = log4js.getLogger('koa2');
        await next();
        const end = Date.now();
        const responseTime = end - start;
        logger.info(`响应时间为: ${(responseTime / 1000).toFixed(4)}s，请求 url : ${ctx.request.url}`);
    }
};
