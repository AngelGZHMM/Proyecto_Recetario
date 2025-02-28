// tests/pasos.test.js
const request = require('supertest');
// IMPORTANTE: Asegúrate de exportar la aplicación Express sin que se inicie el servidor (usando "if (require.main === module)" por ejemplo)
const app = require('../index');
const sequelize = require('../config/sequelize.js');
const initModels = require('../models/init-models.js').initModels;
const models = initModels(sequelize);

// Función auxiliar para extraer el dato real de la respuesta
function extractDatos(body) {
  if (body.hasOwnProperty('datos')) {
    return body.datos;
  } else if (body.hasOwnProperty('data')) {
    return body.data;
  } else {
    return body;
  }
}

describe('Pasos API', () => {
  let testRecetaId;
  let testPasoData;

  beforeAll(async () => {
    // Sincronizar la base de datos (se recrean las tablas)
    await sequelize.sync({ force: true });
    
    // Crear una receta de prueba usando los campos requeridos en la tabla
    const testReceta = await models.receta.create({
      nombre: 'Receta Test',
      imagen: 'http://dummyimage.com/600x400',
      descripcion: 'Receta de prueba para testing',
      tiempo_preparacion: 30,
      dificultad: 'Media',
      fecha_creacion: new Date()
    });
    // Dependiendo del modelo, puede ser testReceta.receta_id o testReceta.id
    testRecetaId = testReceta.receta_id || testReceta.id;

    testPasoData = {
      orden: 1,
      receta: testRecetaId,
      descripcion: 'Paso de prueba',
      ingrediente: 'Ingrediente prueba',
      cantidad: 100,
      unidad_medida: 'gr',
      tipo: 'Preparación',
      duracion: 30,
      necesario: 1
    };
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    // Limpiar la tabla de pasos antes de cada test para evitar interferencias
    await models.pasos.destroy({ where: {} });
  });

  describe('GET /api/pasos', () => {
    it('debería obtener todos los pasos', async () => {
      // Crear un paso de prueba
      await models.pasos.create(testPasoData);
      
      const response = await request(app).get('/api/pasos');
      expect(response.statusCode).toBe(200);
      // Extraer el resultado usando la propiedad "datos" (o "data")
      const result = extractDatos(response.body);
      // Se espera que el resultado sea un arreglo
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[0].descripcion).toBe('Paso de prueba');
    });
  });

  describe('GET /api/pasos/:receta', () => {
    it('debería obtener pasos por receta', async () => {
      await models.pasos.create(testPasoData);
      
      const response = await request(app).get(`/api/pasos/${testRecetaId}`);
      expect(response.statusCode).toBe(200);
      const result = extractDatos(response.body);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[0].receta).toBe(testRecetaId);
    });
  });

  describe('POST /api/pasos', () => {
    it('debería crear un nuevo paso', async () => {
      const response = await request(app)
        .post('/api/pasos')
        .send(testPasoData)
        .set('Content-Type', 'application/json');
      expect(response.statusCode).toBe(200);
      const result = extractDatos(response.body);
      expect(result.descripcion).toBe('Paso de prueba');
    });

    it('debería fallar con descripción corta', async () => {
      const badData = { ...testPasoData, descripcion: 'Corto' };
      const response = await request(app)
        .post('/api/pasos')
        .send(badData)
        .set('Content-Type', 'application/json');
      expect(response.statusCode).toBe(400);
    });
  });

  describe('DELETE /api/pasos/:orden/:receta', () => {
    it('debería eliminar un paso existente', async () => {
      const paso = await models.pasos.create(testPasoData);
      const response = await request(app)
        .delete(`/api/pasos/${paso.orden}/${paso.receta}`);
      expect(response.statusCode).toBe(200);
      const result = extractDatos(response.body);
      // Para eliminación exitosa se espera que "datos" sea 1
      expect(result).toBe(1);
    });

    it('debería fallar al eliminar un paso inexistente', async () => {
      const response = await request(app)
        .delete('/api/pasos/999/999');
      expect(response.statusCode).toBe(200);
      // En este caso, se espera que "datos" sea null
      const body = response.body;
      const result = body.hasOwnProperty('datos') ? body.datos : null;
      expect(result).toBeNull();
    });
  });

  describe('PUT /api/pasos/:orden/:receta', () => {
    it('debería actualizar un paso existente', async () => {
      const paso = await models.pasos.create(testPasoData);
      const updateData = {
        descripcion: 'Descripción actualizada',
        ingrediente: 'Ingrediente actualizado',
        cantidad: 150,
        unidad_medida: 'gr',
        tipo: 'Hornear',
        duracion: 45,
        necesario: 1
      };
      const response = await request(app)
        .put(`/api/pasos/${paso.orden}/${paso.receta}`)
        .send(updateData)
        .set('Content-Type', 'application/json');
      expect(response.statusCode).toBe(200);
      const result = extractDatos(response.body);
      // Se espera que se haya actualizado 1 registro
      expect(result).toBe(1);
    });

    it('debería fallar al actualizar con datos inválidos', async () => {
      const paso = await models.pasos.create(testPasoData);
      const badData = { descripcion: 'Corto' }; // Menos de 7 caracteres
      const response = await request(app)
        .put(`/api/pasos/${paso.orden}/${paso.receta}`)
        .send(badData)
        .set('Content-Type', 'application/json');
      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/pasos/:orden/:receta', () => {
    it('debería obtener un paso específico', async () => {
      const paso = await models.pasos.create(testPasoData);
      const response = await request(app)
        .get(`/api/pasos/${paso.orden}/${paso.receta}`);
      expect(response.statusCode).toBe(200);
      const result = extractDatos(response.body);
      expect(result.orden).toBe(paso.orden);
    });
  });
});
