import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Usuario from './usuario.js';
import Ciudad from './ciudad.js';
import Comuna from './comuna.js';

const Direccion = sequelize.define('Direccion', {
  idDireccion: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  calle: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  numero: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  depto: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  principal: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'direccion',
  timestamps: false
});

// Relaciones
Direccion.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'usuario'
});

Direccion.belongsTo(Ciudad, {
  foreignKey: 'id_ciudad',
  as: 'ciudad'
});

Direccion.belongsTo(Comuna, {
  foreignKey: 'id_comuna',
  as: 'comuna'
});

export default Direccion;
