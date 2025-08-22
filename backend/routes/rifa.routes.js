import { Router } from 'express';
import {
  crearRifa,
  obtenerRifasPublicas,
  verNumerosDeRifa,
  comprarNumerosRifa,
  obtenerRifaActiva,
  desactivarRifa // ✅ Agregado
} from '../controllers/rifa.controller.js';

import { verificarToken } from '../middlewares/authentication.js';
import { verificarTrabajador } from '../middlewares/roles.js';

const router = Router();

// Pública: ver resumen de rifas
router.get('/', obtenerRifasPublicas);

// Privado: obtener rifa activa
router.get('/activa', obtenerRifaActiva);

// Privado: desactivar rifa activa (solo trabajador)
router.patch('/activa', verificarToken, verificarTrabajador, desactivarRifa); // ✅ Nueva ruta

// Privado: ver números de una rifa específica (requiere token)
router.get('/:id/numeros', verificarToken, verNumerosDeRifa);

// Privado: comprar números de una rifa (requiere token)
router.post('/:id/comprar', verificarToken, comprarNumerosRifa);

// Privado: crear rifa (solo trabajador)
router.post('/', verificarToken, verificarTrabajador, crearRifa);

export default router;
