'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class galeria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Empresa, { foreignKey: 'empresa_id' });

    }
  }
  galeria.init({
    empresa_id: {
      type: DataTypes.INTEGER,
      references: {
          model: 'empresa', // nombre de la tabla, no del modelo
          key: 'id'
      }
  },
    imagen: DataTypes.STRING,
    descripcion: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'galeria',
    tableName: 'galeria',  // aquí especificas el nombre exacto de la tabla
    timestamps: false
  });
  return galeria;
};