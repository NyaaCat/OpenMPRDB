const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('servers', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    uuid: {
      type: DataTypes.STRING(36),
      allowNull: false,
      comment: "v4 服务器uuid标识",
      unique: "uuid"
    },
    server_name: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: "服务器名称"
    },
    key_id: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: "服务器签名 key id"
    },
    public_key: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "服务器公钥"
    }
  }, {
    sequelize,
    tableName: 'servers',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "uuid",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "uuid" },
        ]
      },
      {
        name: "key_id",
        using: "BTREE",
        fields: [
          { name: "key_id" },
        ]
      },
    ]
  });
};
