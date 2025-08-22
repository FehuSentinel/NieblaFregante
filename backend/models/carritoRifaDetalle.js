import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import CarritoRifa from './carritoRifa.js';
import NumeroRifa from './numeroRifa.js';

const CarritoRifaDetalle = sequelize.define('CarritoRifaDetalle', {
  idDetalle: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  id_carrito: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  id_numero: {
    type: DataTypes.BIGINT,
    allowNull: false
  }
}, {
  tableName: 'carrito_rifa_detalle',
  timestamps: false
});

// Relaciones
CarritoRifaDetalle.belongsTo(CarritoRifa, {
  foreignKey: 'id_carrito',
  as: 'carrito'
});

CarritoRifa.hasMany(CarritoRifaDetalle, {
  foreignKey: 'id_carrito',
  as: 'detalles'
});

CarritoRifaDetalle.belongsTo(NumeroRifa, {
  foreignKey: 'id_numero',
  as: 'numeroRifa'
});

export default CarritoRifaDetalle;
