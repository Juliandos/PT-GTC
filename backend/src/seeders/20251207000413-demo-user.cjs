'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        email: 'admin@hotelbediax.com',
        password: '$2b$10$10XMPA.SxD1BM2tSrsDlKumTLxkOhBv/7bbW0Z29/SKWdJIbgKwd2', // password hasheado: "admin123"
        name: 'Admin User',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user@hotelbediax.com',
        password: '$2b$10$.XjT9JDJIGO4l81i.y/1iOJkibvYoenC/v7thg1D69Vhw8Aaah2rm', // password hasheado: "user123"
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