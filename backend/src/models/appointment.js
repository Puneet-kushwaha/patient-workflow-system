"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Appointment extends Model {
        static associate(models) {
            Appointment.belongsTo(models.User, {
                foreignKey: "patientId",
                as: "patient",
            });

            Appointment.belongsTo(models.Doctor, {
                foreignKey: "doctorId",
                as: "doctor",
            });
        }
    }

    Appointment.init(
        {
            patientId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            doctorId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            time: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM("Scheduled", "Completed", "Cancelled"),
                allowNull: false,
                defaultValue: "Scheduled",
            },
            notes: {
                type: DataTypes.TEXT,
            },
        },
        {
            sequelize,
            modelName: "Appointment",
        }
    );

    return Appointment;
};
