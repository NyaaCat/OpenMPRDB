const Router = require('koa-router');
const submitRouter = require('./submit');
const serverRouter = require('./server');

let router = new Router();
router.all('/',async (ctx,next)=>{
    console.log(ctx.request);
    next();
})
router.use('/submit', submitRouter.routes(), submitRouter.allowedMethods())
router.use('/server', serverRouter.routes(), serverRouter.allowedMethods())

module.exports = router;
