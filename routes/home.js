var router = require('koa-router');
let homeRouter = new router();
homeRouter.get('/', async function (ctx) {
    ctx.body = '<h3>index</h3>';
});
homeRouter.get('/foo', async function (ctx) {
    ctx.body = '<h3>foo</h3>';
});

module.exports = homeRouter;
