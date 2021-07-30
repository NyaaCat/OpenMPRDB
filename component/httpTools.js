module.exports = {
    httpResponse(ctx,data,status=200){
        let statusDesc = 'OK';
        if(status!==200){
            statusDesc = 'NG';
        }
        let res = {
            status:statusDesc
        }
        ctx.response.status = status;
        ctx.body = Object.assign(res,data);
        return ctx;
    }
};
