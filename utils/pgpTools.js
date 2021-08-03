const openpgp = require('openpgp');
module.exports ={
    async getKeyIdBySignature(signedMessage,publicKeyArmored){
        let publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
        let verificationResult = await openpgp.verify({
            message: signedMessage,
            verificationKeys: publicKey
        });
        let { verified, keyID} = verificationResult.signatures[0];
        //因为这玩意现在不是json了，换成kv模式，需要解析一次
        //let messageData = JSON.parse(verificationResult.data);
        let data = verificationResult.data;
        let dataArr = data.split('\n');
        let messageData = {};
        for(let dataItem of dataArr){
            dataItem = dataItem.replace(/\\r/g,'');
            dataItem = dataItem.replace(/ /g,'');
            let dataItemArr = dataItem.split(':');
            if(dataItemArr.length===1){
                continue;
            }
            //如果解析出来的每一行长度不是2说明传上来不是key:value直接抛出错误
            if(dataItemArr.length<2){
                throw 'messageDataInvaid'
            }
            messageData[dataItemArr[0]] = dataItemArr[1]
        }

        return {verified,keyID,messageData};
    },
    async getServerDataAndVerified(params,ctx){
        let message = params.message;
        if(!message){
            throw 'messageNotExist';
        }
        let signedMessage = await openpgp.readCleartextMessage({cleartextMessage:message});
        let keyIds = signedMessage.getSigningKeyIDs();
        let keyId = keyIds[0].toHex();
        //查询数据库中对应的server获取公钥
        let {servers} = ctx.db;
        let server = await servers.findOne({
            where:{
                key_id:keyId
            }
        });
        if(!server){
            throw 'serverNotExist';
        }
        let {verified,messageData} = await ctx.pgpTools.getKeyIdBySignature(signedMessage,server.public_key);
        //验证失败会直接throws on invalid signature 所以这边不用做判断了
        let isVerified = await verified;
        ctx.loggerKoa2.info('当前请求isVerified',isVerified);
        return {message,messageData,server};
    }
}
