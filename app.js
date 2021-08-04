const Koa = require('koa')
    //, logger = require('koa-logger') //替换成log4js了，后边需要再说
    , json = require('koa-json')
    , onerror = require('koa-onerror');

const router = require('./routes');

const log4js = require('./component/log4js');
const httpTools = require('./component/httpTools');
const errorCode = require('./component/errorCode');
const pgpTools = require('./utils/pgpTools');
const commonConfig = require('./config/common_config.json');


const db = require('./db');

let app = new Koa();
// error handler
onerror(app);

app.context.db = db;
app.context.httpTools = httpTools;
app.context.errorCode = errorCode;
app.context.pgpTools = pgpTools;
app.context.commonConfig = commonConfig;


app.use(require('koa-bodyparser')());
app.use(json());
app.use(log4js.koaLogger());

//app.use(require('koa-static')(__dirname + '/public'));

// routes definition
app.use(router.routes()).use(router.allowedMethods());



// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app;
