"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash("password123", 10);
    const now = new Date();

    await queryInterface.bulkInsert("Users", [
      {
        name: "Admin",
        email: "admin@gmail.com",
        password: await bcrypt.hash("password", 10),
        role: "Admin",
        createdAt: now,
        updatedAt: now
      },
      {
        name: "Patient",
        email: "patient@gmail.com",
        password: await bcrypt.hash("password", 10),
        role: "Patient",
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  }
};
