var DataTypes = require("sequelize").DataTypes;
var _pasos = require("./pasos");
var _receta = require("./receta");

function initModels(sequelize) {
  var pasos = _pasos(sequelize, DataTypes);
  var receta = _receta(sequelize, DataTypes);

  pasos.belongsTo(receta, { as: "receta_RECETum", foreignKey: "receta"});
  receta.hasMany(pasos, { as: "PASOs", foreignKey: "receta"});

  return {
    pasos,
    receta,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
