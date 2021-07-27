const Sequelize = require("sequelize");
const config = require("./config/db_config.json").mysql;
const initModels = require("./models/init-models");

const sequelize = new Sequelize(config.database, config.user,config.password,config);
let db = initModels(sequelize);


module.exports = db;
