import Trabajador from '../models/trabajador.js';

export const verificarTrabajador = async (req, res, next) => {
  try {
    const idUsuario = req.user?.id_usuario;
    console.log('🔍 verificando idUsuario:', idUsuario);

    const trabajador = await Trabajador.findOne({ where: { idTrabajador: idUsuario } });

    if (!trabajador) {
      console.log('❌ No es trabajador (no encontrado en tabla)');
      return res.status(403).json({ error: 'Acceso restringido a trabajadores o administradores.' });
    }

    console.log('✅ Es trabajador:', trabajador.toJSON());
    req.trabajador = trabajador;
    next();
  } catch (error) {
    console.error('Error en verificarTrabajador:', error);
    res.status(500).json({ error: 'Error al verificar permisos' });
  }
};

