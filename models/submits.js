const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('submits', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    uuid: {
      type: DataTypes.STRING(36),
      allowNull: false,
      comment: "player_uuid",
      unique: "uuid"
    },
    server_uuid: {
      type: DataTypes.STRING(36),
      allowNull: false,
      comment: "服务器uuid"
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "消息体"
    }
  }, {
    sequelize,
    tableName: 'submits',
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
        name: "server_uuid",
        using: "BTREE",
        fields: [
          { name: "server_uuid" },
        ]
      },
    ]
  });
};
