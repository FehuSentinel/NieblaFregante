import Direccion from '../models/direccion.js';
import Ciudad from '../models/ciudad.js';
import Comuna from '../models/comuna.js';

/**
 * ✅ Crear nueva dirección
 * - Si `principal: true`, desactiva otras
 * - Si es primera dirección del usuario, la marca como principal automáticamente
 * - Si no hay sesión (invitado), guarda sin usuario ni principal
 */
export const crearDireccion = async (req, res) => {
  try {
    const id_usuario = req.user?.id_usuario || null;
    const { calle, numero, depto, comentario, id_ciudad, id_comuna, principal } = req.body;

    if (!calle || !numero || !id_ciudad || !id_comuna) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Solo si es usuario registrado
    let esPrincipal = false;
    if (id_usuario) {
      const direccionesCount = await Direccion.count({ where: { id_usuario } });

      if (principal === true) {
        // Desmarcar otras
        await Direccion.update({ principal: false }, { where: { id_usuario } });
        esPrincipal = true;
      } else if (direccionesCount === 0) {
        esPrincipal = true; // Primera dirección automáticamente principal
      }
    }

    const direccion = await Direccion.create({
      id_usuario,
      calle,
      numero,
      depto,
      comentario,
      id_ciudad,
      id_comuna,
      principal: esPrincipal
    });

    res.status(201).json(direccion);
  } catch (error) {
    console.error('❌ Error al crear dirección:', error);
    res.status(500).json({ error: 'Error al crear dirección' });
  }
};

/**
 * ✅ Obtener todas las direcciones del usuario
 */
export const obtenerDirecciones = async (req, res) => {
  try {
    const id_usuario = req.user?.id_usuario;

    if (!id_usuario) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const direcciones = await Direccion.findAll({
      where: { id_usuario },
      include: [
        { model: Ciudad, as: 'ciudad' },
        { model: Comuna, as: 'comuna' }
      ]
    });

    res.json(direcciones);
  } catch (error) {
    console.error('❌ Error al obtener direcciones:', error);
    res.status(500).json({ error: 'Error al obtener direcciones' });
  }
};

/**
 * ✅ Obtener la dirección principal
 */
export const obtenerDireccionPrincipal = async (req, res) => {
  try {
    const id_usuario = req.user?.id_usuario;

    if (!id_usuario) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const direccion = await Direccion.findOne({
      where: { id_usuario, principal: true },
      include: [
        { model: Ciudad, as: 'ciudad' },
        { model: Comuna, as: 'comuna' }
      ]
    });

    if (!direccion) {
      return res.status(404).json({ error: 'No hay dirección principal' });
    }

    res.json(direccion);
  } catch (error) {
    console.error('❌ Error al obtener dirección principal:', error);
    res.status(500).json({ error: 'Error al obtener dirección principal' });
  }
};

/**
 * ✅ Cambiar dirección principal desde el perfil del usuario
 */
export const cambiarDireccionPrincipal = async (req, res) => {
  try {
    const id_usuario = req.user?.id_usuario;
    const idDireccion = req.params.id;

    if (!id_usuario) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const direccion = await Direccion.findOne({
      where: { idDireccion, id_usuario }
    });

    if (!direccion) {
      return res.status(404).json({ error: 'Dirección no encontrada' });
    }

    // Desmarcar todas
    await Direccion.update({ principal: false }, { where: { id_usuario } });

    // Marcar esta como principal
    direccion.principal = true;
    await direccion.save();

    res.json({ mensaje: 'Dirección marcada como principal' });
  } catch (error) {
    console.error('❌ Error al cambiar dirección principal:', error);
    res.status(500).json({ error: 'Error al actualizar dirección' });
  }
};

/**
 * ✅ Eliminar dirección (solo si es del usuario)
 */
export const eliminarDireccion = async (req, res) => {
  try {
    const id_usuario = req.user?.id_usuario;
    const id = req.params.id;

    const direccion = await Direccion.findOne({
      where: {
        idDireccion: id,
        id_usuario
      }
    });

    if (!direccion) {
      return res.status(404).json({ error: 'Dirección no encontrada' });
    }

    await direccion.destroy();
    res.json({ mensaje: 'Dirección eliminada correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar dirección:', error);
    res.status(500).json({ error: 'Error al eliminar dirección' });
  }
};
