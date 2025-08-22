import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CategoriaProducto = sequelize.define('CategoriaProducto', {
  id_categoria: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'categorias_producto',
  timestamps: false
});

export default CategoriaProducto;
