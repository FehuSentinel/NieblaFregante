import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Usuario from './usuario.js';
import Direccion from './direccion.js';
import TransaccionWebpay from './TransaccionWebpay.js'; // asegúrate de que el nombre del archivo esté bien

const Pedido = sequelize.define('Pedido', {
  idPedido: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  estado: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'PENDIENTE'
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  fechaPedido: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tipoEntrega: {
    type: DataTypes.STRING(20), // 'retiro' o 'despacho'
    allowNull: false
  }
}, {
  tableName: 'pedidos',
  timestamps: false
});

// Relaciones
Pedido.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'usuario',
});

Pedido.belongsTo(Direccion, {
  foreignKey: 'id_direccion',
  as: 'direccion',
});

Pedido.belongsTo(TransaccionWebpay, {
  foreignKey: 'id_transaccion_webpay',
  as: 'transaccion',
});

export default Pedido;
