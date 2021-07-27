var DataTypes = require("sequelize").DataTypes;
var _servers = require("./servers");
var _submits = require("./submits");

function initModels(sequelize) {
  var servers = _servers(sequelize, DataTypes);
  var submits = _submits(sequelize, DataTypes);


  return {
    servers,
    submits,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
