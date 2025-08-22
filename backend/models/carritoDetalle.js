import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Carrito from './carrito.js';
import Producto from './producto.js';

const CarritoDetalle = sequelize.define('CarritoDetalle', {
  idDetalle: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  precioUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Precio con o sin descuento en el momento de agregar',
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'precioUnitario * cantidad (congelado para el pago)',
  }
}, {
  tableName: 'carrito_detalle',
  timestamps: false,
});

// Relaciones
CarritoDetalle.belongsTo(Carrito, {
  foreignKey: 'id_carrito',
  as: 'carrito',
});
Carrito.hasMany(CarritoDetalle, {
  foreignKey: 'id_carrito',
  as: 'detalles',
});

CarritoDetalle.belongsTo(Producto, {
  foreignKey: 'id_producto',
  as: 'producto',
});
Producto.hasMany(CarritoDetalle, {
  foreignKey: 'id_producto',
  as: 'detallesCarrito',
});

export default CarritoDetalle;
