const openpgp = require('openpgp');
module.exports ={
    async getKeyIdBySignature(signedMessage,publicKey){

        let verificationResult = await openpgp.verify({
            message: signedMessage,
            verificationKeys: publicKey
        });
        let { verified, keyID} = verificationResult.signatures[0];
        let messageData = JSON.parse(verificationResult.data);
        return {verified,keyID,messageData};
    },
    async getServerDataAndVerified(params,ctx){
        let message = params.message;
        if(!message){
            throw 'messageNotExist';
        }
        let signedMessage = await openpgp.readCleartextMessage({message});
        let keyIds = signedMessage.getSigningKeyIDs();
        let keyId = keyIds[0].toHex();
        //查询数据库中对应的server获取公钥
        let {servers} = ctx.db;
        let server = await servers.find({
            where:{
                key_id:keyId
            }
        });
        if(!server){
            throw 'serverNotExist';
        }
        let publicKey = servers.public_key;
        let {verified,messageData} = await ctx.pgpTools.getKeyIdBySignature(signedMessage,publicKey);
        //验证失败会直接throws on invalid signature 所以这边不用做判断了
        let isVerified = await verified;
        ctx.loggerKoa2('当前server/register请求isVerified',isVerified);
        return {message,messageData,server};
    }
}
