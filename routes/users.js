var router = require('koa-router')();

router.prefix('/users');

router.get('/', async function (next) {
  this.body = 'this is a users response!';
});

router.get('/bar', async function (next) {
  this.body = 'this is a users/bar response!';
});

module.exports = router;
