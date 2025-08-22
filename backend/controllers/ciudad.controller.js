import Ciudad from '../models/ciudad.js';

export const obtenerCiudades = async (req, res) => {
  try {
    const ciudades = await Ciudad.findAll();
    res.json(ciudades);
  } catch (error) {
    console.error('Error al obtener ciudades:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
