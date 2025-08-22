import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Pedido from './pedido.js';
import Usuario from './usuario.js';

const Boleta = sequelize.define('Boleta', {
  idBoleta: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  folio: {
    type: DataTypes.STRING,
    allowNull: true // Se puede completar después si usas API SII
  },
  fechaEmision: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'boletas',
  timestamps: false
});

// Relaciones
Boleta.belongsTo(Pedido, {
  foreignKey: 'id_pedido',
  as: 'pedido'
});

Boleta.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'usuario'
});

export default Boleta;
