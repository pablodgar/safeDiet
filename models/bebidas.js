'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bebidas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  bebidas.init({
    id_bebida: { 
      allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
    },
    descripcion: DataTypes.STRING,
    kcal: DataTypes.FLOAT,
    hc: DataTypes.FLOAT,
    apto_celiaco : DataTypes.TINYINT(1),
    apto_diabetico : DataTypes.TINYINT(1),
    url_imagen: DataTypes.STRING,
    tipo: DataTypes.STRING,
    unidad: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'bebidas',
  });
  return bebidas;
};