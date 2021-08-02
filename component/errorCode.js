const errorCodeZh = require('../config/error_code_zh.json');
const log4js = require('./log4js').getLogger();
let koaLog = log4js.getLogger('koa');
const errorCodeObj = {
    zh:errorCodeZh
}

module.exports = {
    getErrorMsg(errorKey, lang = 'zh'){
        let msg = errorCodeObj[lang][errorKey];
        if(msg){
            return msg;
        }
        //如果是标准的Error对象的话则取其中的message部分
        if(errorKey instanceof Error){
            return errorKey.message
        }
        koaLog.error(errorCodeObj[lang]['errorCodeMsgNotFound']);
        return '';
    }
}
