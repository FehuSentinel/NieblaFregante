import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Usuario from './usuario.js';

const Carrito = sequelize.define('Carrito', {
  idCarrito: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  fechaCreacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  estado: {
    type: DataTypes.STRING,
    defaultValue: 'activo', 
  }
}, {
  tableName: 'carritos',
  timestamps: false,
});

Carrito.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'usuario',
});
Usuario.hasOne(Carrito, {
  foreignKey: 'id_usuario',
  as: 'carrito',
});

export default Carrito;
