const router = require('koa-router');
let submitRouter = new router();

submitRouter.put('/new',async function(ctx){
    ctx.body = 'this is a submit/new put method';
})

submitRouter.delete('/uuid/:submit_uuid', async function (ctx) {
    ctx.body = 'this is a delete method submit/uuid/'+ctx.params.submit_uuid+' response!';
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
