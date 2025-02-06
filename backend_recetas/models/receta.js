const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('receta', {
    receta_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    imagen: {
      type: DataTypes.STRING(5000),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(5000),
      allowNull: false
    },
    tiempo_preparacion: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dificultad: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    fecha_creacion: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'RECETA',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "receta_id" },
        ]
      },
    ]
  });
};
