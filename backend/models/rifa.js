import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Producto from './producto.js';

const Rifa = sequelize.define('Rifa', {
  idRifa: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },

  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  precioNumero: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  fechaSorteo: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'fecha_sorteo'
  },
  activa: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  numero_ganador: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
}, {
  tableName: 'rifas',
  timestamps: false
});



// 🔁 Relación con Producto (productoPremio)
Rifa.belongsTo(Producto, {
  foreignKey: 'id_producto_premio',
  as: 'productoPremio'
});

Producto.hasMany(Rifa, {
  foreignKey: 'id_producto_premio',
  as: 'rifas'
});

export default Rifa;
