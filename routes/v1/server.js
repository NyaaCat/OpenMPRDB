const router = require('koa-router');
const serverService = require('../../service/server');

let serverRouter = new router();

serverRouter.put('/register',async function(ctx){
    let errorCode = ctx.errorCode;
    let params = ctx.request.body;
    try {
        let res = await serverService.registerServer(params,ctx);
        ctx.httpTools.httpResponse(ctx,res);
    } catch (e) {
        let errorMsg = errorCode.getErrorMsg(e)
        ctx.loggerKoa2.error('当前server/register请求报错',errorMsg);
        let status = 400;
        ctx.httpTools.httpResponse(ctx,{reason:errorMsg},status);
    }
});

serverRouter.get('/list', async function (ctx) {
    let errorCode = ctx.errorCode;
    let params = ctx.request.query;
    try {
        let res = await serverService.getServers(params,ctx);
        ctx.httpTools.httpResponse(ctx,res);
    } catch (e) {
        let errorMsg = errorCode.getErrorMsg(e)
        ctx.loggerKoa2.error('当前submit/servers请求报错',errorMsg);
        let status = 401;
        ctx.httpTools.httpResponse(ctx,{reason:errorMsg},status);
    }
});
module.exports = serverRouter;
