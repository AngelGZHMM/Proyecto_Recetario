//Importar libreria para respuestas
const Respuesta = require("../utils/respuesta");
// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");
// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);
// Recuperar el modelo pedidos
const Pasos = models.pasos;

// Recuperar el modelo platos
const Receta = models.receta;

class RecetaController {
  
  async getAllReceta(req, res) {
    try {
      const data = await Receta.findAll(); // Recuperar todos los pedidos
      res.json(Respuesta.exito(data, "Datos de recetas recuperados"));
    } catch (err) {
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos de las recetas: ${req.originalUrl}`
          )
        );
    }
  }

  //buscar receta por receta_id
  async getRecetaById(req, res) {
    try {
      const data = await Receta.findByPk(req.params.receta_id); // Recuperar todos los pedidos
      res.json(Respuesta.exito(data, "Datos de recetas recuperados"));
    } catch (err) {
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos de las recetas: ${req.originalUrl}`
          )
        );
    }
  
  }
//Modificacion de un registro buscado previamente
  async updateReceta(req, res) {
    try {
      const receta = await Receta.findByPk(req.params.receta_id);
      if (receta) {
        const originalData = receta.toJSON(); // Línea añadida
        const data = await receta.update(req.body);
        const updatedData = receta.toJSON(); // Línea añadida

        if (JSON.stringify(originalData) === JSON.stringify(updatedData)) { // Línea añadida
          res.json(Respuesta.error(null, "No se realizaron cambios en la receta")); // Línea añadida
        } else {
        res.json(Respuesta.exito(data, "Receta actualizada"));}
      } else {
        res
          .status(404)
          .json(
            Respuesta.error(
              null,
              `Receta con id ${req.params.receta_id} no encontrada`
            )
          );
      }
    } catch (err) {
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al actualizar la receta: ${req.originalUrl}`
          )
        );
    }
  }

  //Eliminar un registro buscado previamente
  async deleteReceta(req, res) {
    try {
      const receta = await Receta.findByPk(req.params.receta_id);
      if (receta) {
        const data = await receta.destroy();
        res.json(Respuesta.exito(data, "Receta eliminada"));
      } else {
        res
          .status(404)
          .json(
            Respuesta.error(
              null,
              `Receta con id ${req.params.receta_id} no encontrada`
            )
          );
      }
    } catch (err) {
      console.error(`Error al eliminar la receta: ${err.message}`); // Imprimir el error completo
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al eliminar la receta: ${req.originalUrl}`
          )
        );
    }
  }

  //Crear un nuevo registro
  async createReceta(req, res) {
    try {
      console.log("Datos recibidos:", req.body); // Imprimir los datos recibidos
      req.body.fecha_creacion = (new Date()).toLocaleDateString();
      const data = await Receta.create(req.body);
      res.json(Respuesta.exito(data, "Receta creada"));
    } catch (err) {
      console.error(`Error al crear la receta: ${err.message}`); // Imprimir el error completo
      console.error(err); // Imprimir el objeto de error completo para más detalles
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al crear la receta: ${req.originalUrl}`
          )
        );
    }
  }
}

module.exports = RecetaController;
