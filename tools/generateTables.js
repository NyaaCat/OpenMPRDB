let dbModels = require('../db');
(async ()=>{
    let modelKeys = Object.keys(dbModels);
    for(let key of modelKeys){
        let model = dbModels[key];
        await model.sync({ force: true });
    }
})()
