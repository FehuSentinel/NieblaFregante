import express from 'express';
import { crearTransaccion, confirmarTransaccion } from '../controllers/pago.controller.js';
import { confirmarPagoRifa, crearTransaccionRifa} from '../controllers/PagoRifa.controller.js';

const router = express.Router();

router.post('/crear-transaccion', crearTransaccion);
router.post('/confirmar-transaccion', confirmarTransaccion);
router.post('/rifa/confirmar', confirmarPagoRifa);
router.post('/rifa/crear-transaccion', crearTransaccionRifa);



export default router;
