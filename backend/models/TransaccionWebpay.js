import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const TransaccionWebpay = sequelize.define('TransaccionWebpay', {
  idTransaccion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  ordenCompra: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sesionId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  monto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING,
    defaultValue: 'INICIADA'
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'transacciones_webpay',
  timestamps: false
});

export default TransaccionWebpay;
