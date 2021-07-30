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
      comment: "v4 服务器uuid标识",
      unique: "uuid"
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
      {
        name: "uuid",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "uuid" },
        ]
      },
    ]
  });
};
