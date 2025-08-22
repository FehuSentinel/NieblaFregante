import { WebpayPlus } from '../config/transbank.js';

import TransaccionWebpay from '../models/TransaccionWebpay.js';
import Pedido from '../models/pedido.js';
import PedidoDetalle from '../models/pedidodetalle.js';
import Producto from '../models/producto.js';
import Direccion from '../models/direccion.js';

// Crear transacción e ir a Webpay
export const crearTransaccion = async (req, res) => {
  const { monto, ordenCompra, id_usuario } = req.body;

  try {
    const sesionId = `sesion-${Date.now()}`;
    const response = await new WebpayPlus.Transaction().create(
      ordenCompra,
      sesionId,
      monto,
      'http://localhost:5173/retorno-webpay'
    );

    await TransaccionWebpay.create({
      token: response.token,
      ordenCompra,
      sesionId,
      monto,
      estado: 'INICIADA'
    });

    res.json({
      url: response.url,
      token: response.token
    });
  } catch (error) {
    console.error('❌ Error al crear transacción:', error);
    res.status(500).json({ error: 'No se pudo iniciar el pago' });
  }
};

// Confirmar transacción (retorno desde Webpay)
export const confirmarTransaccion = async (req, res) => {
  const { token_ws, carrito, metodoEntrega, direccion, id_usuario } = req.body;

  try {
    const resultado = await new WebpayPlus.Transaction().commit(token_ws);
    if (resultado.response_code !== 0) {
      return res.status(400).json({ error: 'Transacción rechazada por Webpay' });
    }

    const transaccion = await TransaccionWebpay.findOne({ where: { token: token_ws } });
    if (!transaccion) {
      return res.status(404).json({ error: 'Transacción no encontrada' });
    }

    // Validar stock
    for (const item of carrito) {
      const producto = await Producto.findByPk(item.idProducto);
      if (!producto || producto.stock < item.cantidad) {
        return res.status(400).json({ error: `Stock insuficiente para ${item.nombre}` });
      }
    }

    // Descontar stock
    for (const item of carrito) {
      const producto = await Producto.findByPk(item.idProducto);
      producto.stock -= item.cantidad;
      await producto.save();
    }

    // Crear dirección si es despacho
    let idDireccion = null;
    if (metodoEntrega === 'despacho' && direccion) {
      const nuevaDireccion = await Direccion.create({
        calle: direccion.calle,
        numero: direccion.numero,
        depto: direccion.depto || null,
        comentario: direccion.comentario || null,
        id_ciudad: direccion.id_ciudad,
        id_comuna: direccion.id_comuna,
        id_usuario: id_usuario || null,
        principal: true
      });
      idDireccion = nuevaDireccion.idDireccion;
    }

    // Crear pedido
    const nuevoPedido = await Pedido.create({
      id_usuario: id_usuario || null,
      id_direccion: idDireccion,
      total: transaccion.monto,
      comentario: direccion?.comentario || null,
      estado: 'PAGADO',
      tipoEntrega: metodoEntrega,
      id_transaccion_webpay: transaccion.idTransaccion
    });

    // Crear detalles del pedido
    for (const item of carrito) {
      await PedidoDetalle.create({
        id_pedido: nuevoPedido.idPedido,
        id_producto: item.idProducto,
        cantidad: item.cantidad,
        precio_unitario: item.precio
      });
    }

    // Actualizar estado de la transacción
    transaccion.estado = 'APROBADA';
    await transaccion.save();

    res.status(200).json({ mensaje: '✅ Pedido creado con éxito', pedido: nuevoPedido });

  } catch (error) {
    console.error('❌ Error al confirmar transacción:', error);
    res.status(500).json({ error: 'Error al confirmar el pago' });
  }
};
