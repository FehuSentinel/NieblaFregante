import Boleta from '../models/boleta.js';
import BoletaDetalle from '../models/boletaDetalle.js';
import Producto from '../models/producto.js';

// ✅ Ver todas las boletas del usuario
export const obtenerBoletasUsuario = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;

    const boletas = await Boleta.findAll({
      where: { id_usuario },
      order: [['fechaEmision', 'DESC']]
    });

    res.json(boletas);
  } catch (error) {
    console.error('❌ Error al obtener boletas:', error);
    res.status(500).json({ error: 'Error al obtener boletas' });
  }
};

// ✅ Ver detalle de una boleta específica
export const obtenerBoletaPorId = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;
    const id = req.params.id;

    const boleta = await Boleta.findOne({
      where: { idBoleta: id, id_usuario },
      include: {
        model: BoletaDetalle,
        as: 'detalles',
        include: { model: Producto, as: 'producto' }
      }
    });

    if (!boleta) {
      return res.status(404).json({ error: 'Boleta no encontrada' });
    }

    res.json(boleta);
  } catch (error) {
    console.error('❌ Error al obtener boleta:', error);
    res.status(500).json({ error: 'Error al obtener la boleta' });
  }
};
