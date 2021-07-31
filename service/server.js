const openpgp = require('openpgp');
const { v4: uuidv4 } = require('uuid');

module.exports ={
    async registerServer(params,ctx){
        let message = params.message;
        let publicKey = params.public_key;

        if(!publicKey){
            // noinspection ExceptionCaughtLocallyJS
            throw 'publicKeyNotExist';
        }
        let signedMessage = await openpgp.readCleartextMessage({message});
        let {verified,keyID,messageData} = await ctx.pgpTools.getKeyIdBySignature(signedMessage,publicKey);
        //不存在服务器名字抛出错误
        if(!messageData.server_name){
            // noinspection ExceptionCaughtLocallyJS
            throw 'serverNameEmpty';
        }
        let isVerified = await verified; // throws on invalid signature
        ctx.loggerKoa2('当前server/register请求isVerified',isVerified);
        keyID = keyID.toHex();
        let {servers} = ctx.db;
        let server = await servers.find({
            where:{
                key_id:keyID
            }
        });
        // 如果存在服务器，并且公钥不相同的情况，则说明key_id重复了
        if(server&&server.public_key!==publicKey){
            throw 'publicKeyDuplicate';
        }
        // 如果不存在服务器则加入，如果存在的话则抛出错误
        if(servers){
            // noinspection ExceptionCaughtLocallyJS
            throw 'repeatRegistration';
        }
        let uuid = uuidv4();
        let createData = {
            uuid:uuid,
            server_name:messageData.server_name,
            key_id:keyID,
            public_key:publicKey
        };
        await servers.create(createData);
        ctx.loggerKoa2('当前server/register 服务器创建成功',JSON.stringify(createData));
        return {
            uuid:uuid
        };
    }
};
