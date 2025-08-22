import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Ciudad = sequelize.define('Ciudad', {
  idCiudad: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'ciudades',
  timestamps: false
});

export default Ciudad;
