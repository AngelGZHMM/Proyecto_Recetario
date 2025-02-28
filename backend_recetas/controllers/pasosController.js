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

class PasosController {
  
  async getAllPasos(req, res) {
    try {
      const data = await Pasos.findAll(
        {
          order: [
            ['receta', 'ASC'],
            ['orden', 'ASC']
          ]
        }
      ); // Recuperar todos los pedidos
      res.json(Respuesta.exito(data, "Datos de pedidos recuperados"));
    } catch (err) {
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos de los pasos: ${req.originalUrl}`
          )
        );
    }
  }

  //Buscar pasos por codigo receta
  //en la tabla pasos hay un codigo  receta quiero buscar por ese codigo
  //quiero hacer esta llamada y que me muestre todos los pasos en el que el campo receta sea 1
  async getPasosByReceta(req, res) {
    try {
      const data = await Pasos.findAll({
        where: {
          receta: req.params.receta, // Corregido: req.params.receta
        },
        order: [
          ['orden', 'ASC']
        ]
      });

      res.json(Respuesta.exito(data, "Datos de pasos recuperados"));
    } catch (err) {
      console.error(`Error: ${err.message}`); // Imprimir el error
      console.log(err); // Imprimir el objeto de error completo para más detalles

      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos de los pasos: ${req.originalUrl}`
          )
        );
    }
  }
// quiero recuperar el numero de pasos de cada receta
async getGraficaPasos(req, res) {
  try {
    const pasosGrafica = await Pasos.findAll({
      attributes: [
        "receta",
        [sequelize.fn("COUNT", sequelize.col("orden")), "numpasos"]
      ],
      group: ["receta"],
      raw: true
    });
    res.json(Respuesta.exito(pasosGrafica, "Datos de pasos recuperados"));
  } catch (err) {
    logMensaje("Error al recuperar los datos de pasos: " + err);
    res.status(500).json(
      Respuesta.error(
        null,
        `Error al recuperar los datos de pasos: ${req.originalUrl}`
      )
    );
  }
}













  //Crear un paso
  async createPaso(req, res) {
    try {
      console.log("Datos recibidos:", req.body); // Imprimir los datos recibidos
  
      const { descripcion, cantidad, unidad_medida, tipo, duracion } = req.body;
  
      // Validaciones
      if (descripcion.length < 7) {
        return res.status(400).json(Respuesta.error(null, "Descripción debe ser más larga."));
      }
  
      if (cantidad && !unidad_medida) {
        return res.status(400).json(Respuesta.error(null, "Debe haber unidad de medida si hay cantidad."));
      }
      if (!cantidad && unidad_medida) {
        return res.status(400).json(Respuesta.error(null, "Debe haber cantidad si hay unidad de medida."));
      }
  
      if (!tipo) {
        return res.status(400).json(Respuesta.error(null, "El campo tipo es obligatorio."));
      }
  
      if (!duracion) {
        return res.status(400).json(Respuesta.error(null, "El campo duración es obligatorio."));
      }
  
      // Asegurarse de que los valores sean compatibles con los tipos de datos de la base de datos
      const pasoData = {
        ...req.body,
        cantidad: cantidad ? parseFloat(cantidad) : null,
      };
  
      const data = await Pasos.create(pasoData);
      res.json(Respuesta.exito(data, "Paso creado correctamente"));
    } catch (err) {
      console.error(`Error al crear el paso: ${err.message}`); // Imprimir el mensaje de error
      console.error("Error stack:", err.stack); // Imprimir el stack trace del error
      console.error("Error details:", err); // Imprimir el objeto de error completo para más detalles
  
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al crear el paso, Ya existe.`
          )
        );
    }
  }
//borrar paso x de la receta x
  //las pk de paso son orden y receta
  async deletePaso(req, res) {
    try {
      const data = await Pasos.destroy({
        where: {
          orden: req.params.orden,
          receta: req.params.receta,
        },
      });

      if (data == 1) {
        res.json(Respuesta.exito(data, "Paso eliminado correctamente"));
      } else {
        res.json(Respuesta.error(null, "No se pudo eliminar el paso"));
      }
    } catch (err) {
      console.error(`Error al eliminar el paso: ${err.message}`); // Imprimir el mensaje de error
      console.error(err); // Imprimir el objeto de error completo para más detalles

      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al eliminar el paso: ${req.originalUrl}`
          )
        );
    }
  }

  //actualizar paso debe actualizar el paso que tenga las mismas dos pk que son orden y receta
  async updatePaso(req, res) {
    try {
      // Imprimir los parámetros recibidos
      console.log(`Parámetros recibidos - Orden: ${req.params.orden}, Receta: ${req.params.receta}`);
  
      const { descripcion, cantidad, unidad_medida, tipo, duracion } = req.body;
  
      // Validaciones
      if (descripcion && descripcion.length < 7) {
        return res.status(400).json(Respuesta.error(null, "Descripción debe ser más larga."));
      }
  
      if (cantidad && !unidad_medida) {
        return res.status(400).json(Respuesta.error(null, "Debe haber unidad de medida si hay cantidad."));
      }
      if (!cantidad && unidad_medida) {
        return res.status(400).json(Respuesta.error(null, "Debe haber cantidad si hay unidad de medida."));
      }
  
      if (tipo === undefined || tipo === null) {
        return res.status(400).json(Respuesta.error(null, "El campo tipo es obligatorio."));
      }
  
      if (duracion === undefined || duracion === null) {
        return res.status(400).json(Respuesta.error(null, "El campo duración es obligatorio."));
      }
  
      // Verificar si el paso existe
      const paso = await Pasos.findOne({
        where: {
          orden: req.params.orden,
          receta: req.params.receta,
        },
      });
  
      // Imprimir el resultado de la búsqueda
      console.log(`Resultado de la búsqueda del paso: ${JSON.stringify(paso)}`);
  
      if (!paso) {
        console.log("El paso no existe");
        return res.status(404).json(Respuesta.error(null, "El paso no existe"));
      }
      const pasoData = {
        ...req.body,
        cantidad: cantidad ? parseFloat(cantidad) : null,
      };
  
      // Intentar actualizar el paso
      const [updated] = await Pasos.update(req.body, {
        where: {
          orden: req.params.orden,
          receta: req.params.receta,
        },
      });
  
      // Imprimir el resultado de la actualización
      console.log(`Resultado de la actualización: ${updated}`);
  
      if (updated) {
        res.json(Respuesta.exito(updated, "Paso actualizado correctamente"));
      } else {
        res.json(Respuesta.error(null, "No se pudo actualizar el paso, los datos son iguales"));
      }
    } catch (err) {
      console.error(`Error al actualizar el paso: ${err.message}`); // Imprimir el mensaje de error
      console.error(err); // Imprimir el objeto de error completo para más detalles
  
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al actualizar el paso: ${req.originalUrl}`
          )
        );
    }
  }

  //Buscar un paso por orden y receta
  async getPaso(req, res) {
    try {
      const data = await Pasos.findOne({
        where: {
          orden: req.params.orden,
          receta: req.params.receta,
        },
      });

      res.json(Respuesta.exito(data, "Datos del paso recuperados"));
    } catch (err) {
      console.error(`Error: ${err.message}`); // Imprimir el error
      console.log(err); // Imprimir el objeto de error completo para más detalles

      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos del paso: ${req.originalUrl}`
          )
        );
    }
  }
  


}

module.exports = PasosController;
