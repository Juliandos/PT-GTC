'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Obtener los IDs reales de los usuarios de la base de datos
    const [adminUser] = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE email = 'admin@hotelbediax.com' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const [testUser] = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE email = 'user@hotelbediax.com' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!adminUser || !testUser) {
      throw new Error('Los usuarios deben existir antes de crear destinos. Ejecuta primero el seeder de usuarios.');
    }

    const adminUserId = adminUser.id;
    const testUserId = testUser.id;
    
    await queryInterface.bulkInsert('Destinations', [
      // Destinos del Admin
      {
        name: 'Playa del Carmen',
        description: 'Hermosa playa en la Riviera Maya con aguas cristalinas y arena blanca. Perfecta para buceo y relajación.',
        countryCode: 'MX',
        type: 'Beach',
        userId: adminUserId,
        lastModif: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Machu Picchu',
        description: 'Antigua ciudadela inca ubicada en las montañas de los Andes peruanos. Una de las 7 maravillas del mundo moderno.',
        countryCode: 'PE',
        type: 'Cultural',
        userId: adminUserId,
        lastModif: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'París',
        description: 'La ciudad de la luz, famosa por la Torre Eiffel, el Louvre y su rica historia cultural y gastronómica.',
        countryCode: 'FR',
        type: 'City',
        userId: adminUserId,
        lastModif: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Monte Everest',
        description: 'La montaña más alta del mundo, ubicada en la cordillera del Himalaya. Desafío para montañistas experimentados.',
        countryCode: 'NP',
        type: 'Mountain',
        userId: adminUserId,
        lastModif: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bungee Jumping en Nueva Zelanda',
        description: 'Experiencia extrema de salto al vacío desde puentes y plataformas en uno de los destinos de aventura más populares del mundo.',
        countryCode: 'NZ',
        type: 'Adventure',
        userId: adminUserId,
        lastModif: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Destinos del User
      {
        name: 'Bali',
        description: 'Isla paradisíaca de Indonesia con playas exóticas, templos antiguos y una cultura única. Perfecta para relajación y espiritualidad.',
        countryCode: 'ID',
        type: 'Beach',
        userId: testUserId,
        lastModif: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tokio',
        description: 'Metrópolis futurista que combina tecnología avanzada con tradiciones milenarias. Destino perfecto para cultura y gastronomía.',
        countryCode: 'JP',
        type: 'City',
        userId: testUserId,
        lastModif: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Alpes Suizos',
        description: 'Cordillera montañosa con paisajes espectaculares, estaciones de esquí de clase mundial y pueblos alpinos encantadores.',
        countryCode: 'CH',
        type: 'Mountain',
        userId: testUserId,
        lastModif: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Rafting en el Río Colorado',
        description: 'Aventura extrema navegando por rápidos de clase mundial en el Gran Cañón. Experiencia única para amantes de la adrenalina.',
        countryCode: 'US',
        type: 'Adventure',
        userId: testUserId,
        lastModif: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Acrópolis de Atenas',
        description: 'Sitio arqueológico histórico con el Partenón, símbolo de la antigua Grecia y cuna de la civilización occidental.',
        countryCode: 'GR',
        type: 'Cultural',
        userId: testUserId,
        lastModif: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Destinations', null, {});
  }
};
