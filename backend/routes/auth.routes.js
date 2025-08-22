import { Router } from 'express';
import { registrarCliente, login, recuperarPassword, reestablecerPassword, loginConGoogleToken  } from '../controllers/auth.controller.js';

const router = Router();

router.post('/registro', registrarCliente);
router.post('/login', login);

// 🔐 Recuperación de contraseña
router.post('/recuperar', recuperarPassword);
router.post('/reestablecer/:token', reestablecerPassword);

router.post('/google-token', loginConGoogleToken);


export default router;
