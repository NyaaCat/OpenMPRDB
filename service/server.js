const openpgp = require('openpgp');
const { v4: uuidv4 } = require('uuid');

module.exports ={
    async registerServer(params,ctx){
        let message = params.message;
        let publicKeyArmored = params.public_key;

        if(!publicKeyArmored){
            // noinspection ExceptionCaughtLocallyJS
            throw 'publicKeyNotExist';
        }
        let signedMessage = await openpgp.readCleartextMessage({cleartextMessage:message});
        let {verified,keyID,messageData} = await ctx.pgpTools.getKeyIdBySignature(signedMessage,publicKeyArmored);
        //不存在服务器名字抛出错误
        if(!messageData.server_name){
            // noinspection ExceptionCaughtLocallyJS
            throw 'serverNameEmpty';
        }
        let isVerified = await verified; // throws on invalid signature
        ctx.loggerKoa2.info('当前server/register请求isVerified',isVerified);
        keyID = keyID.toHex();
        let {servers} = ctx.db;
        let server = await servers.findOne({
            where:{
                key_id:keyID
            }
        });
        // 如果存在服务器，并且公钥不相同的情况，则说明key_id重复了
        if(server&&server.public_key!==publicKeyArmored){
            throw 'publicKeyDuplicate';
        }
        // 如果不存在服务器则加入，如果存在的话则抛出错误
        if(server){
            // noinspection ExceptionCaughtLocallyJS
            throw 'repeatRegistration';
        }
        let uuid = uuidv4();
        let createData = {
            uuid:uuid,
            server_name:messageData.server_name,
            key_id:keyID,
            public_key:publicKeyArmored
        };
        await servers.create(createData);
        ctx.loggerKoa2.info('当前server/register 服务器创建成功',JSON.stringify(createData));
        return {
            uuid:uuid
        };
    },
    async delete(params,uuid,ctx){
        let {message,messageData,server} = await ctx.pgpTools.getServerDataAndVerified(params,ctx);
        let servers = ctx.db.servers;
        if(uuid!==server.uuid){
            ctx.loggerKoa2.info('当前server delete 提交的uuid与实际签名中的key_id所指向uuid不一致。req uuid:'+uuid+'----key_id指向uuid:'+server.uuid);
            throw 'serverNotExist';
        }
        let isSuccess = await servers.destroy({
            where:{
                uuid:uuid
            }
        });
        //删除失败的情况
        if(!isSuccess){
            throw 'deleteFailed';
        }
        ctx.loggerKoa2.info('server delete 删除成功，uuid:'+uuid,JSON.stringify(messageData));
        return {uuid};
    },
    async getServers(params,ctx){
        let {servers} = ctx.db;
        let options = {
            attributes:['id','uuid','server_name','key_id','public_key'],
            order:[['id','desc']]
        };
        let limit;
        if(params.limit){
            limit = params.limit;
        }else{
            limit = ctx.commonConfig.submitsQueryLimit
        }
        options.limit = limit;
        let serverList = await  servers.findAll(options);
        return {servers:serverList};
    }
};
