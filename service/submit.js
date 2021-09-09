const validator = require('validator');
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize");
const dateFormat = require('dateformat');

module.exports ={
    async addNew(params,ctx){
        let {message,messageData,server} = await ctx.pgpTools.getServerDataAndVerified(params,ctx);
        if(!messageData.uuid||!validator.isUUID(messageData.uuid)){
            throw 'UUIDInvaid'
        }
        if(!messageData.timestamp||!/^[0-9]*[1-9][0-9]*$/.test(messageData.timestamp)){
            throw 'timestampInvaid'
        }
        if(!messageData.player_uuid||!validator.isUUID(messageData.player_uuid)){
            throw 'playerUUIDInvaid'
        }
        //校验传值区间
        let points = parseFloat(messageData.points);
        if(isNaN(points)){
            throw 'pointsNotNumber'
        }
        if((points>-0.1&&points<0.1)||points>1||points<-1){
            throw 'pointsIntervalInvaid'
        }
        //取一位小数
        points = points.toFixed(1);
        let uuid = uuidv4();
        let createData = {
            uuid:uuid,
            server_uuid:server.uuid,
            content:message
        };
        await ctx.db.submits.create(createData);
        ctx.loggerKoa2.info('当前submit/new 信息创建成功',JSON.stringify(createData));
        return {
            uuid:uuid
        };
    },
    async delete(params,uuid,ctx){
        let {message,messageData,server} = await ctx.pgpTools.getServerDataAndVerified(params,ctx);
        let submits = ctx.db.submits;
        let submit = await submits.findOne({
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

    async getSubmit(submit_uuid,ctx){
        let {submits} = ctx.db;
        let submit = await  submits.findOne({
            where:{
                uuid:submit_uuid
            },
            attributes:['uuid','server_uuid','content']
        });
        if(!submit){
            throw 'submitDataNotExist';
        }
        return submit.dataValues
    },
    async getServerSubmitList(server_uuid,ctx){
        let {submits} = ctx.db;
        let queryParams = ctx.request.query;
        let whereCondition = {
            server_uuid:server_uuid
        };

        let options = {
            attributes:['id','uuid','server_uuid','content'],
            where:whereCondition,
            order:[['id','desc']]
        };

        //按条件查询
        let limit;
        if(queryParams.limit){
            if(!/^[0-9]*[1-9][0-9]*$/.test(queryParams.limit)){
                throw 'limitInvaid'
            }
            limit = queryParams.limit;
        }else{
            limit = ctx.commonConfig.submitsQueryLimit
        }
        options.limit = parseInt(limit);
        if(queryParams.after){
            if(!/^[0-9]*[1-9][0-9]*$/.test(queryParams.after)){
                throw 'afterInvaid'
            }
            whereCondition.createdAt = {
                [Op.gt]:dateFormat(new Date(queryParams.after), "yyyy-mm-dd hh:MM:ss")
            }
        }
        let submitList = await submits.findAll(options);
        if(!submitList||submitList.length===0){
            throw 'submitDataNotExist';
        }
        return {submits: submitList}
    },
    async getServerSubmitListByKeyId(server_key_id,ctx){
        let {submits,servers} = ctx.db;
        let server = await servers.findOne({
            where:{
                key_id:server_key_id
            }
        });
        if(!server){
            throw 'serverNotExist';
        }
        let queryParams = ctx.request.query;
        let whereCondition = {
            server_uuid:server.uuid
        };
        let options = {
            attributes:['id','uuid','server_uuid','content'],
            where:whereCondition,
            order:[['id','desc']]
        };
        //按条件查询
        let limit;
        if(queryParams.limit){
            if(!/^[0-9]*[1-9][0-9]*$/.test(queryParams.limit)){
                throw 'limitInvaid'
            }
            limit = queryParams.limit;
        }else{
            limit = ctx.commonConfig.submitsQueryLimit
        }
        options.limit = parseInt(limit);
        if(queryParams.after){
            if(!/^[0-9]*[1-9][0-9]*$/.test(queryParams.after)){
                throw 'afterInvaid'
            }
            whereCondition.createdAt = {
                [Op.gt]:dateFormat(new Date(queryParams.after), "yyyy-mm-dd hh:MM:ss")
            }
        }
        let submitList = await submits.findAll(options);
        if(!submitList||submitList.length===0){
            throw 'submitDataNotExist';
        }
        return {submits: submitList}
    }
};
