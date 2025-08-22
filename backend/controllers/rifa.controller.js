import Rifa from '../models/rifa.js';
import Producto from '../models/producto.js';
import NumeroRifa from '../models/numeroRifa.js';
import Usuario from '../models/usuario.js';

// ✅ Crear nueva rifa (solo trabajador)
export const crearRifa = async (req, res) => {
  try {
    const { nombre, id_producto_premio, precioNumero, fechaSorteo, cantidadNumeros } = req.body;

    const nuevaRifa = await Rifa.create({
      nombre,
      id_producto_premio,
      precioNumero,
      fechaSorteo
    });

    const numeros = [];
    for (let i = 1; i <= cantidadNumeros; i++) {
      numeros.push({ numero: i, id_rifa: nuevaRifa.idRifa });
    }

    await NumeroRifa.bulkCreate(numeros);

    res.status(201).json({ mensaje: 'Rifa creada exitosamente', rifa: nuevaRifa });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear rifa' });
  }
};

// ✅ Ver todas las rifas (resumen público)
export const obtenerRifasPublicas = async (req, res) => {
  try {
    const rifas = await Rifa.findAll({
      where: { activa: true },
      include: [
        {
          model: Producto,
          as: 'productoPremio'
        },
        {
          model: NumeroRifa,
          as: 'numeros',
          attributes: ['vendido']
        }
      ]
    });

    const resumen = rifas.map(rifa => {
      const vendidos = rifa.numeros.filter(n => n.vendido).length;
      const total = rifa.numeros.length;

      return {
        id: rifa.idRifa,
        nombre: rifa.nombre,
        productoPremio: rifa.productoPremio,
        vendidos,
        total
      };
    });

    res.json(resumen);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener rifas' });
  }
};

// ✅ Ver números de una rifa (solo logueado)
export const verNumerosDeRifa = async (req, res) => {
  try {
    const { id } = req.params;

    const numeros = await NumeroRifa.findAll({
      where: { id_rifa: id },
      attributes: ['idNumero', 'numero', 'vendido']
    });

    const disponibles = numeros.filter(n => !n.vendido);
    const vendidos = numeros.filter(n => n.vendido);

    res.json({
      disponibles,
      vendidos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los números de la rifa' });
  }
};

// ✅ Comprar números de rifa (se usa al agregar al carrito)
export const comprarNumerosRifa = async (req, res) => {
  try {
    const { id } = req.params;
    const { numerosSeleccionados } = req.body;
    const idUsuario = req.user.id_usuario;

    const rifa = await Rifa.findByPk(id);
    if (!rifa || !rifa.activa) {
      return res.status(404).json({ error: 'Rifa no válida' });
    }

    const numerosDisponibles = await NumeroRifa.findAll({
      where: {
        id_rifa: id,
        numero: numerosSeleccionados,
        vendido: false
      }
    });

    if (numerosDisponibles.length !== numerosSeleccionados.length) {
      return res.status(409).json({ error: 'Algunos números ya fueron vendidos' });
    }

    for (const num of numerosDisponibles) {
      await num.update({ vendido: true, id_usuario: idUsuario });
    }

    res.status(200).json({ mensaje: 'Números comprados exitosamente' });
  } catch (error) {
    console.error('❌ Error al comprar números de rifa:', error);
    res.status(500).json({ error: 'Error en la compra de números' });
  }
};


// ✅ Obtener rifa activa con números vendidos y total
export const obtenerRifaActiva = async (req, res) => {
  try {
    const rifa = await Rifa.findOne({
      where: { activa: true },
      include: [
        {
          model: Producto,
          as: 'productoPremio'
        },
        {
          model: NumeroRifa,
          as: 'numeros',
          attributes: ['numero', 'vendido', 'idNumero'] // ✅ aquí
        }
      ]
    });

    if (!rifa) return res.json({ rifa: null });

    const rifaJson = rifa.toJSON();

    const numerosVendidos = rifaJson.numeros
      .filter(n => n.vendido)
      .map(n => n.numero);

    const totalNumeros = rifaJson.numeros.length;

    const numerosConId = rifaJson.numeros.map(n => ({
      numero: n.numero,
      idNumero: n.idNumero
    }));

    res.json({
      rifa: {
        ...rifaJson,
        numerosVendidos,
        totalNumeros,
        numerosConId // ✅ se pasa al frontend
      },
      producto: rifaJson.productoPremio
    });
  } catch (error) {
    console.error('❌ Error al obtener rifa activa:', error);
    res.status(500).json({ error: 'Error al obtener rifa activa' });
  }
};



// ✅ Desactivar rifa activa (solo trabajador)
export const desactivarRifa = async (req, res) => {
  try {
    const rifa = await Rifa.findOne({ where: { activa: true } });

    if (!rifa) {
      return res.status(404).json({ error: 'No hay rifa activa para desactivar' });
    }

    rifa.activa = false;
    await rifa.save();

    res.json({ mensaje: 'Rifa desactivada exitosamente' });
  } catch (error) {
    console.error('❌ Error al desactivar rifa:', error);
    res.status(500).json({ error: 'Error al desactivar la rifa' });
  }
};
