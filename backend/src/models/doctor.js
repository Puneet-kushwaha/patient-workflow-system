"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    static associate(models) {

    }
  }
  Doctor.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        specialty: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        location: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        bio: {
          type: DataTypes.TEXT,
        },
        profilePicture: {
          type: DataTypes.STRING
        },
      },
      {
        sequelize,
        modelName: "Doctor",
      }
  );
  return Doctor;
};
