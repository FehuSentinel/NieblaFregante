import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Rifa from './rifa.js';
import Usuario from './usuario.js';

const NumeroRifa = sequelize.define('NumeroRifa', {
  idNumero: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  numero: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vendido: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  fechaReserva: {
    type: DataTypes.DATE,
    allowNull: true
  },
  idReservadoPor: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

}, {
  tableName: 'numeros_rifa',
  timestamps: false
});

// 🔁 Relación con Rifa
NumeroRifa.belongsTo(Rifa, {
  foreignKey: 'id_rifa',
  as: 'rifa'
});

Rifa.hasMany(NumeroRifa, {
  foreignKey: 'id_rifa',
  as: 'numeros'
});

// 🔁 Relación con Usuario (opcional)
NumeroRifa.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'usuario'
});

Usuario.hasMany(NumeroRifa, {
  foreignKey: 'id_usuario',
  as: 'numerosRifa'
});

export default NumeroRifa;
