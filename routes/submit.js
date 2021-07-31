const router = require('koa-router');
const submitService = require('../service/submit');
let submitRouter = new router();

submitRouter.put('/new',async function(ctx){
    let errorCode = ctx.errorCode;
    let params = ctx.request.body;
    try {
        let res = await submitService.addNew(params,ctx);
        ctx.httpTools.httpResponse(ctx,res);
    } catch (e) {
        let errorMsg = errorCode.getErrorMsg(e)
        ctx.loggerKoa2('当前submit/new请求报错',errorMsg);
        let status = 400;
        ctx.httpTools.httpResponse(ctx,{reason:errorMsg},status);
    }
});

submitRouter.delete('/uuid/:submit_uuid', async function (ctx) {
    let errorCode = ctx.errorCode;
    let params = ctx.request.body;
    let submit_uuid = ctx.params.submit_uuid;
    try {
        let res = await submitService.delete(params,submit_uuid,ctx);
        ctx.httpTools.httpResponse(ctx,res);
    } catch (e) {
        let errorMsg = errorCode.getErrorMsg(e)
        ctx.loggerKoa2('当前submit/delete请求报错',errorMsg);
        let status = 401;
        ctx.httpTools.httpResponse(ctx,{reason:errorMsg},status);
    }
});

submitRouter.get('/servers', async function (ctx) {
    ctx.body = 'this is a submit/servers response!';
});

submitRouter.get('/uuid/:submit_uuid', async function (ctx) {
    ctx.body = 'this is a get method submit/uuid/'+ctx.params.submit_uuid+' response!';
});

submitRouter.get('/server/:submit_uuid', async function (ctx) {
    ctx.body = 'this is a get method submit/server/'+ctx.params.submit_uuid+' response!';
});

submitRouter.get('/key/:submit_uuid', async function (ctx) {
    ctx.body = 'this is a get method submit/key/'+ctx.params.submit_uuid+' response!';
});


module.exports = submitRouter;
