const Router = require('koa-router');
const v1Router = require('./v1/index');

let router = new Router();

router.use('/v1', v1Router.routes(), v1Router.allowedMethods());

module.exports = router;
