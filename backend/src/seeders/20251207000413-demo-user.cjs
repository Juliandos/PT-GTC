'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        email: 'admin@hotelbediax.com',
        password: '$2a$10$rQ8K5K5K5K5K5K5K5K5K5O', // password hasheado: "admin123"
        name: 'Admin User',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user@hotelbediax.com',
        password: '$2a$10$rQ8K5K5K5K5K5K5K5K5K5O', // password hasheado: "user123"
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};