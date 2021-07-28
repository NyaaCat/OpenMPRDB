const Koa = require('koa')
    //, logger = require('koa-logger') //替换成log4js了，后边需要再说
    , json = require('koa-json')
    , onerror = require('koa-onerror');
const log4js = require('./component/log4js')
const router = require('./routes/index');

const db = require('./db');

let app = new Koa();
// error handler
onerror(app);

app.use(require('koa-bodyparser')());
app.use(json());
app.use(log4js());

app.use(require('koa-static')(__dirname + '/public'));

// routes definition
app.use(router.routes()).use(router.allowedMethods());
app.use(async (ctx,next)=>{
    ctx.db = db;
    next();
});

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app;
