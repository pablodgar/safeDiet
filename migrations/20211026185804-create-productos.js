'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('productos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      descripcion: {
        type: Sequelize.STRING
      },
      kcal: {
        type: Sequelize.FLOAT
      },
      hc: {
        type: Sequelize.FLOAT
      },
      rnpa: {
        type: Sequelize.STRING
      },
      url_imagen: {
        type: Sequelize.STRING
      },
      gr_unidad_media: {
        type: Sequelize.FLOAT
      },
      gr_unidad_chica: {
        type: Sequelize.FLOAT
      },
      gr_unidad_grande: {
        type: Sequelize.FLOAT
      },
      unidad: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('productos');
  }
};