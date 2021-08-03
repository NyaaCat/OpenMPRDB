const router = require('koa-router');
const submitService = require('../../service/submit');
let submitRouter = new router();

submitRouter.put('/new',async function(ctx){
    let errorCode = ctx.errorCode;
    let params = ctx.request.body;
    try {
        let res = await submitService.addNew(params,ctx);
        ctx.httpTools.httpResponse(ctx,res);
    } catch (e) {
        let errorMsg = errorCode.getErrorMsg(e)
        ctx.loggerKoa2.error('当前submit/new请求报错',errorMsg);
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
        ctx.loggerKoa2.error('当前submit/delete请求报错',errorMsg);
        let status = 401;
        ctx.httpTools.httpResponse(ctx,{reason:errorMsg},status);
    }
});

submitRouter.get('/servers', async function (ctx) {
    let errorCode = ctx.errorCode;
    let params = ctx.request.query;
    try {
        let res = await submitService.servers(params,ctx);
        ctx.httpTools.httpResponse(ctx,res);
    } catch (e) {
        let errorMsg = errorCode.getErrorMsg(e)
        ctx.loggerKoa2.error('当前submit/servers请求报错',errorMsg);
        let status = 401;
        ctx.httpTools.httpResponse(ctx,{reason:errorMsg},status);
    }
});

submitRouter.get('/uuid/:submit_uuid', async function (ctx) {
    let errorCode = ctx.errorCode;
    let submit_uuid = ctx.params.submit_uuid;
    try {
        let res = await submitService.getSubmit(submit_uuid,ctx);
        ctx.httpTools.httpResponse(ctx,res);
    } catch (e) {
        let errorMsg = errorCode.getErrorMsg(e)
        ctx.loggerKoa2.error('当前submit/uuid/'+submit_uuid+'请求报错',errorMsg);
        let status = 401;
        ctx.httpTools.httpResponse(ctx,{reason:errorMsg},status);
    }
});

submitRouter.get('/server/:server_uuid', async function (ctx) {
    let errorCode = ctx.errorCode;
    let server_uuid = ctx.params.server_uuid;
    try {
        let res = await submitService.getServerSubmitList(server_uuid,ctx);
        ctx.httpTools.httpResponse(ctx,res);
    } catch (e) {
        let errorMsg = errorCode.getErrorMsg(e)
        ctx.loggerKoa2.error('当前submit/server/'+server_uuid+'请求报错',errorMsg);
        let status = 401;
        ctx.httpTools.httpResponse(ctx,{reason:errorMsg},status);
    }
});

submitRouter.get('/key/:server_key_id', async function (ctx) {
    let errorCode = ctx.errorCode;
    let server_key_id = ctx.params.server_key_id;
    try {
        let res = await submitService.getServerSubmitListByKeyId(server_key_id,ctx);
        ctx.httpTools.httpResponse(ctx,res);
    } catch (e) {
        let errorMsg = errorCode.getErrorMsg(e)
        ctx.loggerKoa2.error('当前submit/server/'+server_key_id+'请求报错',errorMsg);
        let status = 401;
        ctx.httpTools.httpResponse(ctx,{reason:errorMsg},status);
    }
});


module.exports = submitRouter;
