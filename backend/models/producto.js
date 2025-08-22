import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import CategoriaProducto from './categoriaProducto.js'; // Asegúrate de tener este modelo creado

const Producto = sequelize.define('Producto', {
  idProducto: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  marca: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  imagenUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ml: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  concentracion: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  enPromocion: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  porcentajeDescuento: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  precioConDescuento: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  popularidad: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'productos',
  timestamps: false
});

// Relación con CategoriaProducto
Producto.belongsTo(CategoriaProducto, {
  foreignKey: 'id_categoria',
  as: 'categoria'
});

CategoriaProducto.hasMany(Producto, {
  foreignKey: 'id_categoria',
  as: 'productos'
});

export default Producto;
