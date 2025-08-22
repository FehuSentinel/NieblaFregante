import express from 'express';
import multer from 'multer';
import path from 'path';

import {
  obtenerPromos,
  subirPromo,
  eliminarPromo
} from '../controllers/promocion.controller.js';

import { verificarToken } from '../middlewares/authentication.js';
import { verificarTrabajador } from '../middlewares/roles.js'; // Usamos tu middleware real

const router = express.Router();

// 📁 Configuración de almacenamiento con validación y límite
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/promociones/');
  },
  filename: (req, file, cb) => {
    const nombre = Date.now() + path.extname(file.originalname);
    cb(null, nombre);
  }
});

// ✅ Validar solo archivos de imagen (jpg, jpeg, png, gif)
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes con formato jpeg, jpg, png o gif'));
  }
};

// ✅ Multer configurado con límites y filtro
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  },
  fileFilter
});

/* ──────────────────────────────────────
   📌 Rutas para imágenes promocionales
────────────────────────────────────── */

// 🟢 Pública: obtener imágenes
router.get('/', obtenerPromos);

// 🔒 Trabajador/Admin: subir nueva imagen
router.post(
  '/',
  verificarToken,
  verificarTrabajador,
  upload.single('imagen'),
  subirPromo
);

// 🔒 Trabajador/Admin: eliminar imagen
router.delete(
  '/:nombre',
  verificarToken,
  verificarTrabajador,
  eliminarPromo
);

export default router;
