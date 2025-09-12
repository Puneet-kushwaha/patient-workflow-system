"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MedicalRecord extends Model {
    static associate(models) {
      MedicalRecord.belongsTo(models.User, {
        foreignKey: "patientId",
        as: "patient",
      });

      MedicalRecord.belongsTo(models.Doctor, {
        foreignKey: "doctorId",
        as: "doctor",
      });

      MedicalRecord.belongsTo(models.Appointment, {
        foreignKey: "appointmentId",
        as: "appointment",
      });
    }
  }

  MedicalRecord.init(
      {
        patientId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        doctorId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        appointmentId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        diagnosis: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        prescription: {
          type: DataTypes.TEXT,
        },
        attachments: {
          type: DataTypes.JSON,
        },
      },
      {
        sequelize,
        modelName: "MedicalRecord",
      }
  );

  return MedicalRecord;
};
