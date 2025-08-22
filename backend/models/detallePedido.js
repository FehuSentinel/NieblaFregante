
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Pedido from './pedido.js';
import Producto from './producto.js';

const DetallePedido = sequelize.define('DetallePedido', {
  idDetalle: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'detalle_pedido',
  timestamps: false
});

// Relaciones
DetallePedido.belongsTo(Pedido, {
  foreignKey: 'id_pedido',
  as: 'pedido'
});

Pedido.hasMany(DetallePedido, {
  foreignKey: 'id_pedido',
  as: 'detalles'
});

DetallePedido.belongsTo(Producto, {
  foreignKey: 'id_producto',
  as: 'producto'
});

Producto.hasMany(DetallePedido, {
  foreignKey: 'id_producto',
  as: 'detallesPedido'
});

export default DetallePedido;
