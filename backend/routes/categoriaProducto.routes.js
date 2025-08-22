import { Router } from 'express';
import {
  crearCategoria,
  obtenerCategorias,
  eliminarCategoria
} from '../controllers/categoriaProducto.controller.js';
import { verificarToken } from '../middlewares/authentication.js';
import { verificarTrabajador } from '../middlewares/roles.js';

const router = Router();

// Público: ver categorías
router.get('/', obtenerCategorias);

// Privado: solo trabajadores pueden crear o eliminar
router.post('/', verificarToken, verificarTrabajador, crearCategoria);
router.delete('/:id', verificarToken, verificarTrabajador, eliminarCategoria);

export default router;
