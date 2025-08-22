import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Usuario from './usuario.js';

const Cliente = sequelize.define('Cliente', {
  idCliente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  }
}, {
  tableName: 'clientes',
  timestamps: false
});

// 🔁 Relación 1:1 con Usuario
Cliente.belongsTo(Usuario, {
  foreignKey: 'idCliente',
  targetKey: 'id_usuario',
  as: 'usuario'
});

Usuario.hasOne(Cliente, {
  foreignKey: 'idCliente',
  sourceKey: 'id_usuario',
  as: 'cliente'
});

export default Cliente;
