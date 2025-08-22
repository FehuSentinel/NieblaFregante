import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Ciudad from './ciudad.js';

const Comuna = sequelize.define('Comuna', {
  idComuna: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'comunas',
  timestamps: false
});

// Relación: cada comuna pertenece a una ciudad
Comuna.belongsTo(Ciudad, {
  foreignKey: 'id_ciudad',
  as: 'ciudad'
});

Ciudad.hasMany(Comuna, {
  foreignKey: 'id_ciudad',
  as: 'comunas'
});

export default Comuna;
