import express from 'express';
import { obtenerCiudades } from '../controllers/ciudad.controller.js';
const router = express.Router();

router.get('/', obtenerCiudades);

export default router;
