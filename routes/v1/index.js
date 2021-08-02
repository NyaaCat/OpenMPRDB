const Router = require('koa-router');
const submitRouter = require('./submit');
const serverRouter = require('./server');

let router = new Router();

router.get('/',(ctx,next)=>{
   console.log('v1 home');
   ctx.body = '<h3>v1 home page</h3>'
});

router.use('/submit', submitRouter.routes(), submitRouter.allowedMethods())
router.use('/server', serverRouter.routes(), serverRouter.allowedMethods())

module.exports = router;
