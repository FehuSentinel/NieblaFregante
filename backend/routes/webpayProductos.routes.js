import { Router } from 'express';
import { iniciarTransaccionProductos, confirmarPagoProductos } from '../controllers/webpayProductos.controller.js';
import { verificarToken } from '../middlewares/authentication.js';

const router = Router();

router.post('/init', verificarToken, iniciarTransaccionProductos);

router.post('/response', confirmarPagoProductos);

export default router;
