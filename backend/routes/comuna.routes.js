import express from 'express';
import { obtenerTodasLasComunas, obtenerComunasPorCiudad } from '../controllers/comuna.controller.js';

const router = express.Router();

// Ruta para obtener todas las comunas (opcional)
router.get('/', obtenerTodasLasComunas);

// Ruta para obtener comunas según la ciudad
router.get('/ciudades/:idCiudad/comunas', obtenerComunasPorCiudad);

export default router;
