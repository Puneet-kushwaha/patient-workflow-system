"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserToken extends Model {
    static associate(models) {
      UserToken.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }

  UserToken.init(
      {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        token: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        expiry: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        type: {
          type: DataTypes.ENUM("access", "refresh"),
          allowNull: false,
          defaultValue: "access",
        },
      },
      {
        sequelize,
        modelName: "UserToken",
      }
  );

  return UserToken;
};
