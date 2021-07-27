const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('servers', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    uuid: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: "v4 服务器uuid标识"
    },
    fingerprint: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: "服务器指纹"
    }
  }, {
    sequelize,
    tableName: 'servers',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
