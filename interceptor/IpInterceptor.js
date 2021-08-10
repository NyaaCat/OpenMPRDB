//当前ip的拦截器列表
const ipInterceptorList = {};
class IpInterceptor{
    #rate_limit;
    #ip;
    constructor(ip,ctx) {
        this.#rate_limit = ctx.commonConfig.rate_limit;
        this.#ip = ip;
        this.init()
    }
    init(){
        //起一个定时器到点直接删除对应列表里的ip字段
        setTimeout(()=>{
            this.deleteInterceptor();
        },this.#rate_limit)
    }
    deleteInterceptor(){
        delete ipInterceptorList[this.#ip];
    }
}

module.exports = {
    setIpInterceptor(ip,ctx){
        ipInterceptorList[ip] = new IpInterceptor(ip,ctx);
    },
    getIpInterceptor(ip){
        return ipInterceptorList[ip];
    }
}
