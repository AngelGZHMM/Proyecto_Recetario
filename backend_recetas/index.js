//importar libreria para manejo de configuracion
require('dotenv').config();
// Importar librería express --> web server
const express = require("express");
// Importar librería path, para manejar rutas de ficheros en el servidor
const path = require("path");
// Importar libreria CORS
const cors = require("cors");
// Importar gestores de rutas
const pasosRoutes = require("./routes/pasosRoutes");
const recetaRoutes = require("./routes/recetaRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Configurar middleware para analizar JSON en las solicitudes
app.use(express.json());
console.log("Middleware JSON configurado");

// Configurar CORS para admitir cualquier origen
app.use(cors());
console.log("CORS configurado");

// Configurar rutas de la API Rest
app.use("/api/pasos", pasosRoutes);
app.use("/api/receta", recetaRoutes);
console.log("Rutas configuradas");

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
