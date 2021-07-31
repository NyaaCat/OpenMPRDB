const openpgp = require('openpgp');
const { v4: uuidv4 } = require('uuid');

module.exports ={
    async addNew(params,ctx){
        let {message,messageData,server} = await ctx.pgpTools.getServerDataAndVerified(params,ctx);
        let createData = {
            uuid:messageData.uuid,
            server_uuid:server.uuid,
            content:message
        };
        await ctx.db.submits.create(createData);
        ctx.loggerKoa2('当前submit/new 信息创建成功',JSON.stringify(createData));
        return {
            uuid:messageData.uuid
        };
    },
    async delete(params,uuid,ctx){
        let {message,messageData,server} = await ctx.pgpTools.getServerDataAndVerified(params,ctx);
        let submits = ctx.db.submits;
        let submit = await submits.find({
            where:{
                uuid:uuid
            }
        });
        if(!submit){
            throw 'submitDataNotExist';
        }
        let isSuccess = submits.destroy({
            where:{
                uuid:uuid
            }
        });
        //删除失败的情况
        if(!isSuccess){
            throw 'deleteFailed';
        }
        return {uuid};
    }
};
