import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Usuario from './usuario.js';

const CarritoRifa = sequelize.define('CarritoRifa', {
  idCarrito: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.BIGINT,
    allowNull: false
  }
}, {
  tableName: 'carrito_rifa',
  timestamps: false
});

// Relación con Usuario
CarritoRifa.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'usuario'
});

Usuario.hasOne(CarritoRifa, {
  foreignKey: 'id_usuario',
  as: 'carritoRifa'
});

export default CarritoRifa;
