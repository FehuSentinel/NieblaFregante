import { Op } from 'sequelize';
import CarritoRifa from '../models/carritoRifa.js';
import CarritoRifaDetalle from '../models/carritoRifaDetalle.js';
import NumeroRifa from '../models/numeroRifa.js';

const RESERVA_MINUTOS = 5;

// ✅ Agregar números al carrito y reservarlos
export const agregarNumerosAlCarrito = async (req, res) => {
  try {
    const idUsuario = req.user.id_usuario;
    const { numerosSeleccionados } = req.body;

    if (!Array.isArray(numerosSeleccionados) || numerosSeleccionados.length === 0) {
      return res.status(400).json({ error: 'Debes seleccionar al menos un número' });
    }

    const ahora = new Date();
    const expiracion = new Date(ahora.getTime() - RESERVA_MINUTOS * 60 * 1000);

    // Validar que los números no estén vendidos ni reservados por otros usuarios
    const numerosValidos = await NumeroRifa.findAll({
      where: {
        idNumero: numerosSeleccionados,
        vendido: false,
        [Op.or]: [
          { idReservadoPor: null },
          { fechaReserva: { [Op.lt]: expiracion } },
          { idReservadoPor: idUsuario }
        ]
      }
    });

    if (numerosValidos.length !== numerosSeleccionados.length) {
      return res.status(400).json({
        error: 'Uno o más números ya están reservados o vendidos.'
      });
    }

    // Buscar o crear el carrito del usuario
    let carrito = await CarritoRifa.findOne({ where: { id_usuario: idUsuario } });
    if (!carrito) {
      carrito = await CarritoRifa.create({ id_usuario: idUsuario });
    }

    // Evitar duplicados
    const existentes = await CarritoRifaDetalle.findAll({
      where: {
        id_carrito: carrito.idCarrito,
        id_numero: numerosSeleccionados
      }
    });

    const existentesIds = existentes.map(det => det.id_numero);

    const nuevosDetalles = numerosSeleccionados
      .filter(id => !existentesIds.includes(id))
      .map(id_numero => ({
        id_carrito: carrito.idCarrito,
        id_numero
      }));

    if (nuevosDetalles.length > 0) {
      await CarritoRifaDetalle.bulkCreate(nuevosDetalles);
    }

    await NumeroRifa.update(
      {
        fechaReserva: ahora,
        idReservadoPor: idUsuario
      },
      {
        where: {
          idNumero: numerosSeleccionados
        }
      }
    );

    res.status(200).json({
      mensaje: 'Números agregados al carrito y reservados con éxito'
    });
  } catch (error) {
    console.error('❌ Error al agregar al carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ✅ Ver los números del carrito, limpiando los vencidos automáticamente
export const verCarrito = async (req, res) => {
  try {
    const idUsuario = req.user.id_usuario;
    const ahora = new Date();

    const carrito = await CarritoRifa.findOne({
      where: { id_usuario: idUsuario },
      include: {
        model: CarritoRifaDetalle,
        as: 'detalles',
        include: {
          model: NumeroRifa,
          as: 'numeroRifa'
        }
      }
    });

    if (!carrito) {
      return res.status(200).json({ numeros: [] });
    }

    // Eliminar los números con reserva vencida
    for (const det of carrito.detalles) {
      const fechaReserva = new Date(det.numeroRifa.fechaReserva);
      const vencido =
        !det.numeroRifa.fechaReserva ||
        fechaReserva.getTime() + RESERVA_MINUTOS * 60 * 1000 < ahora.getTime();

      if (vencido) {
        await CarritoRifaDetalle.destroy({
          where: {
            id_carrito: carrito.idCarrito,
            id_numero: det.id_numero
          }
        });

        await NumeroRifa.update(
          {
            fechaReserva: null,
            idReservadoPor: null
          },
          {
            where: {
              idNumero: det.id_numero,
              idReservadoPor: idUsuario
            }
          }
        );
      }
    }

    // Volver a cargar el carrito limpio
    const detallesValidos = await CarritoRifaDetalle.findAll({
      where: { id_carrito: carrito.idCarrito },
      include: {
        model: NumeroRifa,
        as: 'numeroRifa'
      }
    });

    const numeros = detallesValidos
      .filter(det => det.numeroRifa && !det.numeroRifa.vendido)
      .map(det => det.numeroRifa);

    res.status(200).json({ numeros });
  } catch (error) {
    console.error('❌ Error al ver el carrito:', error);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
};

// ✅ Eliminar número del carrito y liberar reserva
export const eliminarNumeroDelCarrito = async (req, res) => {
  try {
    const idUsuario = req.user.id_usuario;
    const { idNumero } = req.params;

    const carrito = await CarritoRifa.findOne({
      where: { id_usuario: idUsuario }
    });

    if (!carrito) {
      return res.status(404).json({ error: 'No se encontró carrito para este usuario' });
    }

    const eliminado = await CarritoRifaDetalle.destroy({
      where: {
        id_carrito: carrito.idCarrito,
        id_numero: idNumero
      }
    });

    if (!eliminado) {
      return res.status(404).json({ error: 'Número no encontrado en el carrito' });
    }

    await NumeroRifa.update(
      {
        fechaReserva: null,
        idReservadoPor: null
      },
      {
        where: {
          idNumero,
          idReservadoPor: idUsuario
        }
      }
    );

    res.status(200).json({ mensaje: 'Número eliminado del carrito y reserva liberada' });
  } catch (error) {
    console.error('❌ Error al eliminar número del carrito:', error);
    res.status(500).json({ error: 'Error al eliminar el número' });
  }
};
