const express = require('express');
const router = express.Router();
const RecetaController = require('../controllers/recetaController.js');

const recetaController = new RecetaController();

// Definir tus rutas aquí
router.get('/', recetaController.getAllReceta);
router.get('/:receta_id', recetaController.getRecetaById);
router.put('/:receta_id', recetaController.updateReceta);
router.delete('/:receta_id', recetaController.deleteReceta);
router.post('/', recetaController.createReceta);




module.exports = router;
