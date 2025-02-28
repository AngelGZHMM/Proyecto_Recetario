const express = require('express');
const router = express.Router();
const PasosController = require('../controllers/pasosController');

const pasosController = new PasosController();

// Definir tus rutas aquí

router.get('/grafica', pasosController.getGraficaPasos);
router.get('/', (req, res) => pasosController.getAllPasos(req, res));
router.get('/:receta', (req, res) => pasosController.getPasosByReceta(req, res));
router.get('/:orden/:receta', (req, res) => pasosController.getPaso(req, res));
router.post('/', pasosController.createPaso);
//delete paso debe recibir las dos pk de la tabla que son orden y receta
router.delete('/:orden/:receta', pasosController.deletePaso);
//update paso debe recibir las dos pk de la tabla que son orden y receta
router.put('/:orden/:receta', pasosController.updatePaso);






module.exports = router;
