// backend/seed/seedCategorias.js
import CategoriaProducto from '../models/categoriaProducto.js';

export const seedCategorias = async () => {
  const categorias = [
    { id_categoria: 1, nombre: 'Hombre' },
    { id_categoria: 2, nombre: 'Mujer' },
    { id_categoria: 3, nombre: 'Niño' },
    { id_categoria: 4, nombre: 'Niña' },
    { id_categoria: 5, nombre: 'Unisex' },
  ];

  for (const cat of categorias) {
    await CategoriaProducto.findOrCreate({
      where: { id_categoria: cat.id_categoria },
      defaults: { nombre: cat.nombre }
    });
  }

  console.log('✅ Categorías precargadas');
};
