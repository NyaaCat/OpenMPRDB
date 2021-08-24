const errorCodeZh = require('../config/error_code_zh.json');
const errorCodeEn = require('../config/error_code_en.json');
const config = require('../config/common_config.json');
const log4js = require('./log4js').getLogger();
let koaLog = log4js.getLogger('koa');
const errorCodeObj = {
    zh:errorCodeZh,
    en:errorCodeEn
}

module.exports = {
    getErrorMsg(errorKey, language = false){
        let lang = language||config.language;
        let msg = errorCodeObj[lang][errorKey];
        if(msg){
            return msg;
        }
        //如果是标准的Error对象的话则取其中的message部分
        if(errorKey instanceof Error){
            return errorKey.stack
        }
        koaLog.error(errorCodeObj[lang]['errorCodeMsgNotFound']);
        return '';
    }
}
