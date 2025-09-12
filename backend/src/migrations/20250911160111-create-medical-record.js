"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("MedicalRecords", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Doctors", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      appointmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Appointments", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      diagnosis: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      prescription: {
        type: Sequelize.TEXT,
      },
      attachments: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("MedicalRecords");
  },
};
