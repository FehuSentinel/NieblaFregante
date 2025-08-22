import CategoriaProducto from '../models/categoriaProducto.js';

// ✅ Crear categoría
export const crearCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;

    const existe = await CategoriaProducto.findOne({ where: { nombre } });
    if (existe) {
      return res.status(400).json({ error: 'La categoría ya existe' });
    }

    const nuevaCategoria = await CategoriaProducto.create({ nombre });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
};

// ✅ Obtener todas las categorías
export const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await CategoriaProducto.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

// ✅ Eliminar categoría por ID
export const eliminarCategoria = async (req, res) => {
  try {
    const categoria = await CategoriaProducto.findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });

    await categoria.destroy();
    res.json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
};
