// controllers/carrito.controller.js
import Carrito from '../models/carrito.js';
import CarritoDetalle from '../models/carritoDetalle.js';
import Producto from '../models/producto.js';
import Usuario from '../models/usuario.js';

// 🔍 Obtener el carrito activo de un usuario
export const obtenerCarritoPorUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;

    const carrito = await Carrito.findOne({
      where: { id_usuario, estado: 'activo' },
      include: {
        model: CarritoDetalle,
        as: 'detalles',
        include: { model: Producto, as: 'producto' },
      },
    });

    if (!carrito) {
      return res.status(200).json({ detalles: [] });
    }

    res.json(carrito);
  } catch (error) {
    console.error('❌ Error al obtener carrito:', error);
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
};

// ✅ Agregar producto al carrito
export const agregarProductoAlCarrito = async (req, res) => {
  try {
    const { id_usuario, id_producto, cantidad } = req.body;

    if (!id_usuario || !id_producto || !cantidad) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    let carrito = await Carrito.findOne({ where: { id_usuario, estado: 'activo' } });
    if (!carrito) {
      carrito = await Carrito.create({ id_usuario, estado: 'activo' });
    }

    const producto = await Producto.findByPk(id_producto);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    const precioUnitario = producto.enPromocion && producto.precioConDescuento
      ? parseFloat(producto.precioConDescuento)
      : parseFloat(producto.precio);

    const existente = await CarritoDetalle.findOne({
      where: { id_carrito: carrito.idCarrito, id_producto },
    });

    if (existente) {
      existente.cantidad += cantidad;
      existente.subtotal = precioUnitario * existente.cantidad;
      await existente.save();
    } else {
      await CarritoDetalle.create({
        id_carrito: carrito.idCarrito,
        id_producto,
        cantidad,
        precioUnitario,
        subtotal: precioUnitario * cantidad,
      });
    }

    res.status(201).json({ mensaje: 'Producto agregado al carrito' });
  } catch (error) {
    console.error('❌ Error al agregar producto:', error);
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
};

// 🔄 Actualizar cantidad de un producto en el carrito
export const actualizarCantidadProducto = async (req, res) => {
  try {
    const { id_usuario, id_producto, cantidad } = req.body;

    const carrito = await Carrito.findOne({ where: { id_usuario, estado: 'activo' } });
    if (!carrito) return res.status(404).json({ error: 'Carrito no encontrado' });

    const detalle = await CarritoDetalle.findOne({
      where: { id_carrito: carrito.idCarrito, id_producto },
    });

    if (!detalle) return res.status(404).json({ error: 'Producto no encontrado en el carrito' });

    detalle.cantidad = cantidad;
    detalle.subtotal = parseFloat(detalle.precioUnitario) * cantidad;
    await detalle.save();

    res.json({ mensaje: 'Cantidad actualizada' });
  } catch (error) {
    console.error('❌ Error al actualizar cantidad:', error);
    res.status(500).json({ error: 'Error al actualizar cantidad' });
  }
};

// 🗑️ Eliminar un producto del carrito
export const eliminarProductoDelCarrito = async (req, res) => {
  try {
    const { id_usuario, id_producto } = req.body;

    const carrito = await Carrito.findOne({ where: { id_usuario, estado: 'activo' } });
    if (!carrito) return res.status(404).json({ error: 'Carrito no encontrado' });

    const eliminado = await CarritoDetalle.destroy({
      where: { id_carrito: carrito.idCarrito, id_producto },
    });

    if (!eliminado) return res.status(404).json({ error: 'Producto no encontrado en el carrito' });

    res.json({ mensaje: 'Producto eliminado del carrito' });
  } catch (error) {
    console.error('❌ Error al eliminar producto del carrito:', error);
    res.status(500).json({ error: 'Error al eliminar producto del carrito' });
  }
};

// 🧹 Vaciar el carrito completo del usuario
export const vaciarCarrito = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const carrito = await Carrito.findOne({ where: { id_usuario, estado: 'activo' } });
    if (!carrito) return res.status(404).json({ error: 'Carrito no encontrado' });

    await CarritoDetalle.destroy({ where: { id_carrito: carrito.idCarrito } });

    res.json({ mensaje: 'Carrito vaciado correctamente' });
  } catch (error) {
    console.error('❌ Error al vaciar carrito:', error);
    res.status(500).json({ error: 'Error al vaciar carrito' });
  }
};
