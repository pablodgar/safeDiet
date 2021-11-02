'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class productos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  productos.init({
    id_producto: { 
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
    rnpa: DataTypes.STRING,
    colacion: DataTypes.TINYINT,
    url_imagen: DataTypes.STRING,
    gr_unidad_media: DataTypes.FLOAT,
    gr_unidad_chica: DataTypes.FLOAT,
    gr_unidad_grande: DataTypes.FLOAT,
    unidad: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'productos',
  });
  return productos;
};