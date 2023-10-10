'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Empresa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.galeria, { foreignKey: 'empresa_id' });

    }
  }
  Empresa.init({
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    historia: DataTypes.STRING,
    fecha: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Empresa',
    tableName: 'empresa', // Añadimos esta línea
    timestamps: false     // Si tu tabla no tiene las columnas createdAt y updatedAt
  });
  return Empresa;
};