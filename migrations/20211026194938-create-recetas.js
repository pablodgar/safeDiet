'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('recetas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      descripcion: {
        type: Sequelize.STRING
      },
      preparacion: {
        type: Sequelize.STRING
      },
      url_imagen: {
        type: Sequelize.STRING
      },
      total_kcal: {
        type: Sequelize.FLOAT
      },
      total_hc: {
        type: Sequelize.FLOAT
      },
      rendimiento: {
        type: Sequelize.INTEGER
      },
      tipo: {
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
    await queryInterface.dropTable('recetas');
  }
};