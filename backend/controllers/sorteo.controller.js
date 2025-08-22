import Rifa from '../models/rifa.js';
import NumeroRifa from '../models/numeroRifa.js';
import Usuario from '../models/usuario.js';
import { enviarCorreoGanador } from '../utils/correo.js';

// 🎰 Sorteo aleatorio de una rifa activa
export const realizarSorteo = async (req, res) => {
  try {
    const { id } = req.params;

    const rifa = await Rifa.findByPk(id, {
      include: {
        model: NumeroRifa,
        as: 'numeros',
        include: { model: Usuario, as: 'usuario' }
      }
    });

    if (!rifa || !rifa.activa) {
      return res.status(404).json({ error: 'Rifa no encontrada o ya finalizada' });
    }

    // Filtrar números vendidos
    const numerosVendidos = rifa.numeros.filter(n => n.vendido && n.usuario);

    if (numerosVendidos.length === 0) {
      return res.status(400).json({ error: 'No hay números vendidos en esta rifa' });
    }

    // Elegir uno al azar
    const ganador = numerosVendidos[Math.floor(Math.random() * numerosVendidos.length)];

    // Actualizar rifa
    
    rifa.numero_ganador = ganador.numero;
    rifa.activa = false;
    await rifa.save();

    

    // Opcional: desactivar rifa
    rifa.activa = false;
    await rifa.save();

    // Enviar correo al ganador
    await enviarCorreoGanador({
      correo: ganador.usuario.correo,
      nombre: ganador.usuario.nombre,
      numero: ganador.numero,
      rifa: rifa.nombre,
      producto: rifa.productoPremio?.nombre || 'Producto'
    });

    res.json({
      mensaje: '¡Sorteo realizado!',
      ganador: {
        nombre: ganador.usuario.nombre,
        correo: ganador.usuario.correo,
        numero: ganador.numero
      },
      numerosVendidos: numerosVendidos.map(n => n.numero)

    });

  } catch (error) {
    console.error('❌ Error al realizar sorteo:', error);
    res.status(500).json({ error: 'No se pudo realizar el sorteo' });
  }
};
