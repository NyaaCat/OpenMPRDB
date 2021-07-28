const Router = require('koa-router');
const homeRouter = require('./home');
const submitRouter = require('./submit');


let router = new Router();
router.use('/', homeRouter.routes(), homeRouter.allowedMethods())
router.use('/submit', submitRouter.routes(), submitRouter.allowedMethods())

module.exports = router;
