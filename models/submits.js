const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('submits', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    uuid: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: "player_uuid"
    },
    server_uuid: {
      type: DataTypes.STRING(32),
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
