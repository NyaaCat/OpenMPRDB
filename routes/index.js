const Router = require('koa-router');
const homeRouter = require('./home');
const submitRouter = require('./submit');
const serverRouter = require('./server');


let router = new Router();
router.use('/', homeRouter.routes(), homeRouter.allowedMethods())
router.use('/submit', submitRouter.routes(), submitRouter.allowedMethods())
router.use('/server', serverRouter.routes(), serverRouter.allowedMethods())

module.exports = router;
