import { WebpayPlus } from '../config/transbank.js';
import TransaccionWebpay from '../models/TransaccionWebpay.js';
import CarritoRifa from '../models/carritoRifa.js';
import CarritoRifaDetalle from '../models/carritoRifaDetalle.js';
import NumeroRifa from '../models/numeroRifa.js';

const RESERVA_MINUTOS = 5;

// ✅ Crear transacción Webpay para rifas
export const crearTransaccionRifa = async (req, res) => {
  try {
    const { id_usuario } = req.body;
    const idNum = Number(id_usuario);
    console.log('🔍 ID recibido:', idNum);

    if (!idNum || isNaN(idNum)) {
      return res.status(400).json({ error: 'ID de usuario inválido o no enviado.' });
    }

    const carrito = await CarritoRifa.findOne({
      where: { id_usuario: idNum },
      include: { model: CarritoRifaDetalle, as: 'detalles' }
    });

    if (!carrito || carrito.detalles.length === 0) {
      return res.status(400).json({ error: 'Carrito vacío o no encontrado.' });
    }

    const montoTotal = carrito.detalles.length * 1000;
    const buyOrder = `RIFA-${carrito.idCarrito}-${Date.now()}`;
    const sessionId = `usuario-${idNum}-${Date.now()}`;
    const returnUrl = 'http://localhost:5173/webpay/retorno-rifa'; // ✅ URL válida explícita

    const response = await new WebpayPlus.Transaction().create(
      buyOrder,
      sessionId,
      montoTotal,
      returnUrl
    );

    await TransaccionWebpay.create({
      token: response.token,
      ordenCompra: buyOrder,
      sesionId: sessionId,
      monto: montoTotal,
      estado: 'INICIADA'
    });


    res.status(200).json({
      token: response.token,
      url: response.url
    });
  } catch (error) {
    console.error('❌ Error al crear transacción Webpay:', error);
    res.status(500).json({ error: 'Error al crear transacción' });
  }
};

// ✅ Confirmar transacción de rifa
export const confirmarPagoRifa = async (req, res) => {
  const { token_ws, id_usuario } = req.body;

  try {
    const idNum = Number(id_usuario);
    if (!idNum || isNaN(idNum)) {
      return res.status(400).json({ error: 'ID de usuario inválido.' });
    }

    const resultado = await new WebpayPlus.Transaction().commit(token_ws);

    if (resultado.response_code !== 0) {
      return res.status(400).json({ error: 'Transacción rechazada por Webpay' });
    }

    const transaccion = await TransaccionWebpay.findOne({ where: { token: token_ws } });
    if (!transaccion) {
      return res.status(404).json({ error: 'Transacción no encontrada' });
    }

    const carrito = await CarritoRifa.findOne({
      where: { id_usuario: idNum },
      include: {
        model: CarritoRifaDetalle,
        as: 'detalles',
        include: { model: NumeroRifa, as: 'numeroRifa' }
      }
    });

    if (!carrito || carrito.detalles.length === 0) {
      return res.status(400).json({ error: 'Carrito vacío o no encontrado' });
    }

    const ahora = new Date();
    const expiracion = new Date(ahora.getTime() - RESERVA_MINUTOS * 60000);

    for (const detalle of carrito.detalles) {
      const numero = detalle.numeroRifa;
      if (
        numero.vendido ||
        numero.idReservadoPor !== idNum ||
        !numero.fechaReserva ||
        new Date(numero.fechaReserva).getTime() < expiracion.getTime()
      ) {
        return res.status(400).json({ error: `El número ${numero.numero} ya no está disponible.` });
      }
    }

    for (const detalle of carrito.detalles) {
      await NumeroRifa.update(
        {
          vendido: true,
          idReservadoPor: null,
          fechaReserva: null,
          fechaVenta: ahora
        },
        { where: { idNumero: detalle.id_numero } }
      );
    }

    transaccion.estado = 'APROBADA';
    await transaccion.save();

    await CarritoRifaDetalle.destroy({ where: { id_carrito: carrito.idCarrito } });
    await CarritoRifa.destroy({ where: { idCarrito: carrito.idCarrito } });

    res.status(200).json({ mensaje: '✅ Pago confirmado. Números asignados correctamente.' });
  } catch (error) {
    console.error('❌ Error al confirmar pago de rifa:', error);
    res.status(500).json({ error: 'Error al confirmar el pago de rifa' });
  }
};
