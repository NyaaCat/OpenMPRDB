var router = require('koa-router')();

router.get('/', async function (next) {
  await this.render('index', {
    title: 'Hello World Koa!'
  });
});

router.get('/foo', async function (next) {
  await this.render('index', {
    title: 'Hello World foo!'
  });
});

module.exports = router;
