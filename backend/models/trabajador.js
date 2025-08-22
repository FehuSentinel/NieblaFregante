import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Usuario from './usuario.js';

const Trabajador = sequelize.define('Trabajador', {
  idTrabajador: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  cargo: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'trabajador',
  timestamps: false
});

// 🔁 Relación 1:1 con Usuario
Trabajador.belongsTo(Usuario, {
  foreignKey: 'idTrabajador',
  targetKey: 'id_usuario',
  as: 'usuario'
});

Usuario.hasOne(Trabajador, {
  foreignKey: 'idTrabajador',
  sourceKey: 'id_usuario',
  as: 'trabajador'
});

export default Trabajador;
