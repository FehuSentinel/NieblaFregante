// controllers/pedido.controller.js
import Pedido from '../models/pedido.js';
import Usuario from '../models/usuario.js';
import Direccion from '../models/direccion.js';

/**
 * Crear un nuevo pedido (luego del pago exitoso)
 */
export const crearPedido = async (req, res) => {
  try {
    const { id_usuario, id_direccion, total, comentario } = req.body;

    if (!total || !id_direccion) {
      return res.status(400).json({ error: 'Total y dirección son obligatorios' });
    }

    const nuevoPedido = await Pedido.create({
      id_usuario: id_usuario || null, // null si es invitado
      id_direccion,
      total,
      comentario: comentario || null,
      estado: 'PAGADO'
    });

    res.status(201).json(nuevoPedido);
  } catch (error) {
    console.error('❌ Error al crear pedido:', error);
    res.status(500).json({ error: 'Error al crear el pedido' });
  }
};

/**
 * Obtener todos los pedidos (admin)
 */
export const obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id_usuario', 'nombre', 'email'] },
        { model: Direccion, as: 'direccion' }
      ],
      order: [['fechaPedido', 'DESC']]
    });

    res.json(pedidos);
  } catch (error) {
    console.error('❌ Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

/**
 * Obtener un pedido por ID (admin o usuario)
 */
export const obtenerPedidoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const pedido = await Pedido.findByPk(id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id_usuario', 'nombre', 'email'] },
        { model: Direccion, as: 'direccion' }
      ]
    });

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.json(pedido);
  } catch (error) {
    console.error('❌ Error al obtener pedido por ID:', error);
    res.status(500).json({ error: 'Error al obtener el pedido' });
  }
};

/**
 * Cambiar estado de un pedido (admin)
 */
export const cambiarEstadoPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevoEstado } = req.body;

    const pedido = await Pedido.findByPk(id);
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });

    pedido.estado = nuevoEstado;
    await pedido.save();

    res.json({ mensaje: 'Estado actualizado', pedido });
  } catch (error) {
    console.error('❌ Error al cambiar estado:', error);
    res.status(500).json({ error: 'Error al actualizar estado del pedido' });
  }
};

/**
 * Obtener pedidos del usuario logueado
 */
export const obtenerPedidosUsuario = async (req, res) => {
  try {
    const id_usuario = req.user?.id_usuario;

    if (!id_usuario) return res.status(401).json({ error: 'No autorizado' });

    const pedidos = await Pedido.findAll({
      where: { id_usuario },
      include: [{ model: Direccion, as: 'direccion' }],
      order: [['fechaPedido', 'DESC']]
    });

    res.json(pedidos);
  } catch (error) {
    console.error('❌ Error al obtener pedidos del usuario:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};
