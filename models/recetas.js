'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class recetas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  recetas.init({
    id_receta: { 
      allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
    },
    descripcion: DataTypes.STRING,
    preparacion: DataTypes.STRING,
    apto_celiaco : DataTypes.TINYINT(1),
    apto_diabetico : DataTypes.TINYINT(1),
    url_imagen: DataTypes.STRING,
    total_kcal: DataTypes.FLOAT,
    total_hc: DataTypes.FLOAT,
    rendimiento: DataTypes.INTEGER,
    tipo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'recetas',
    timestamps: false
  });
  return recetas;
};