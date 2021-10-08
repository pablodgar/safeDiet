'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('patologias', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_patologia: {
        type: Sequelize.INTEGER
      },
      descripcion: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('patologias');
  }
};