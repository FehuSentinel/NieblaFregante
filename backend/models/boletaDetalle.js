import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Boleta from './boleta.js';
import Producto from './producto.js';

const BoletaDetalle = sequelize.define('BoletaDetalle', {
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
  tableName: 'boleta_detalle',
  timestamps: false
});

BoletaDetalle.belongsTo(Boleta, {
  foreignKey: 'id_boleta',
  as: 'boleta'
});

Boleta.hasMany(BoletaDetalle, {
  foreignKey: 'id_boleta',
  as: 'detalles'
});

BoletaDetalle.belongsTo(Producto, {
  foreignKey: 'id_producto',
  as: 'producto'
});

export default BoletaDetalle;
