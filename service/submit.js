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
        let isSuccess = await submits.destroy({
            where:{
                uuid:uuid
            }
        });
        //删除失败的情况
        if(!isSuccess){
            throw 'deleteFailed';
        }
        return {uuid};
    },
    async servers(params,ctx){
        let {servers} = ctx.db;
        let serverList = await  servers.findAll({
            attributes:['uuid','server_name','key_id','public_key']
        });
        return serverList;
    },
    async getSubmit(submit_uuid,ctx){
        let {submits} = ctx.db;
        let submit = await  submits.find({
            where:{
                uuid:submit_uuid
            },
            attributes:['uuid','server_uuid','content']
        });
        if(!submit){
            throw 'submitDataNotExist';
        }
        return submit
    },
    async getServerSubmitList(server_uuid,ctx){
        let {submits} = ctx.db;
        let submitList = await submits.findAll({
            where:{
                server_uuid:server_uuid
            },
            attributes:['uuid','server_uuid','content']
        });
        if(!submitList||submitList.length===0){
            throw 'submitDataNotExist';
        }
        return submitList
    },
    async getServerSubmitListByKeyId(server_key_id,ctx){
        let {submits,servers} = ctx.db;
        let server = servers.find({
            where:{
                key_id:server_key_id
            }
        });
        if(!server){
            throw 'serverNotExist';
        }
        let submitList = await  submits.findAll({
            where:{
                server_uuid:server.uuid
            },
            attributes:['uuid','server_uuid','content']
        });
        if(!submitList||submitList.length===0){
            throw 'submitDataNotExist';
        }
        return submitList
    }
};
