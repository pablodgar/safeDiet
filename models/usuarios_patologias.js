'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usuarios_patologias extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      usuarios_patologias.belongsTo(models.usuarios,
        {
            as: 'usuarios',
            foreignKey: 'id_usuario',
        }
    );
    usuarios_patologias.belongsTo(models.patologias,
        {
            as: 'patologias',
            foreignKey: 'id_patologia',
        }
    );
    }
  };
  usuarios_patologias.init({
    id_usuario: DataTypes.INTEGER,
    id_patologia: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'usuarios_patologias',
    timestamps: false
  });
  return usuarios_patologias;
};