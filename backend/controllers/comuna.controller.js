import Comuna from '../models/comuna.js';
import Ciudad from '../models/ciudad.js';

// Obtener todas las comunas (opcional)
export const obtenerTodasLasComunas = async (req, res) => {
  try {
    const comunas = await Comuna.findAll({
      include: [{ model: Ciudad, as: 'ciudad' }]
    });
    res.json(comunas);
  } catch (error) {
    console.error('❌ Error al obtener comunas:', error);
    res.status(500).json({ error: 'Error al obtener comunas' });
  }
};

// Obtener comunas por ciudad
export const obtenerComunasPorCiudad = async (req, res) => {
  const { idCiudad } = req.params;

  try {
    const ciudad = await Ciudad.findByPk(idCiudad);
    if (!ciudad) {
      return res.status(404).json({ error: 'Ciudad no encontrada' });
    }

    const comunas = await Comuna.findAll({
      where: { id_ciudad: idCiudad }
    });

    res.json(comunas);
  } catch (error) {
    console.error('❌ Error al obtener comunas por ciudad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
