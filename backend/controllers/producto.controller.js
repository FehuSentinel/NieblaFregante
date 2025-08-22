import Producto from '../models/producto.js';
import CategoriaProducto from '../models/categoriaProducto.js';
import multer from 'multer';
import path from 'path';

// Configuración de multer para manejar la subida de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb('Error: Solo se permiten imágenes jpeg, jpg, png o gif');
    }
  }
}).single('imagen');

// ✅ Crear producto
export const crearProducto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'La imagen es obligatoria' });
    }

    const {
      nombre,
      descripcion,
      marca,
      categoria,
      ml,
      stock,
      precio,
      enPromocion,
      porcentajeDescuento
    } = req.body;

    const imagenUrl = req.file.filename;

    if (!nombre || !descripcion || !marca || !categoria || !ml || !stock || !precio) {
      return res.status(400).json({ error: 'Todos los campos obligatorios deben completarse' });
    }

    let precioConDescuento = null;

    // Procesar la promoción si viene activada
    const enPromo = enPromocion === 'true' || enPromocion === true;
    const porcentaje = parseFloat(porcentajeDescuento);

    if (enPromo && !isNaN(porcentaje) && porcentaje > 0 && porcentaje < 100) {
      precioConDescuento = parseFloat(precio) - (parseFloat(precio) * (porcentaje / 100));
    }

    const producto = await Producto.create({
      nombre,
      descripcion,
      marca,
      id_categoria: categoria,
      ml,
      stock,
      precio,
      imagenUrl,
      enPromocion: enPromo,
      porcentajeDescuento: enPromo ? porcentaje : null,
      precioConDescuento: enPromo ? precioConDescuento : null
    });

    res.status(201).json(producto);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};


// ✅ Obtener todos los productos
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: [{ model: CategoriaProducto, as: 'categoria' }],
    });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// ✅ Obtener producto por ID
export const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id, {
      include: [{ model: CategoriaProducto, as: 'categoria' }],
    });

    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar producto' });
  }
};

// ✅ Actualizar producto

export const actualizarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    const {
      nombre,
      descripcion,
      marca,
      categoria,
      ml,
      stock,
      precio,
      enPromocion,
      porcentajeDescuento
    } = req.body;

    const imagenUrl = req.file ? req.file.filename : producto.imagenUrl;

    const enPromo = enPromocion === 'true' || enPromocion === true;
    const porcentaje = parseFloat(porcentajeDescuento);
    let precioConDescuento = null;

    if (enPromo && !isNaN(porcentaje) && porcentaje > 0 && porcentaje < 100) {
      precioConDescuento = parseFloat(precio ?? producto.precio) - ((parseFloat(precio ?? producto.precio) * porcentaje) / 100);
    }

    await producto.update({
      nombre: nombre ?? producto.nombre,
      descripcion: descripcion ?? producto.descripcion,
      marca: marca ?? producto.marca,
      id_categoria: categoria ?? producto.id_categoria,
      ml: ml ?? producto.ml,
      stock: stock ?? producto.stock,
      precio: precio ?? producto.precio,
      imagenUrl,
      enPromocion: enPromo,
      porcentajeDescuento: enPromo ? porcentaje : null,
      precioConDescuento: enPromo ? precioConDescuento : null
    });

    res.json(producto);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};


// ✅ Actualizar stock del producto (con validación de stock negativo)
export const actualizarStockProducto = async (req, res) => {
  try {
    const { cantidad } = req.body;
    const producto = await Producto.findByPk(req.params.id);

    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    const nuevoStock = producto.stock + Number(cantidad);
    if (nuevoStock < 0) {
      return res.status(400).json({ error: 'El stock no puede ser negativo' });
    }

    producto.stock = nuevoStock;
    await producto.save();

    res.json(producto);
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    res.status(500).json({ error: 'Error al actualizar el stock del producto' });
  }
};

// ✅ Eliminar producto
export const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    await producto.destroy();
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};


// ✅ Aplicar promoción a un producto
export const aplicarPromocion = async (req, res) => {
  try {
    const { id } = req.params;
    const { porcentaje } = req.body;

    // Validar el porcentaje
    const porcentajeNum = parseFloat(porcentaje);
    if (isNaN(porcentajeNum) || porcentajeNum <= 0 || porcentajeNum >= 100) {
      return res.status(400).json({ error: 'El porcentaje debe ser un número entre 0 y 100' });
    }

    // Buscar el producto
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Calcular el precio con descuento
    const descuento = producto.precio * (porcentajeNum / 100);
    const precioConDescuento = producto.precio - descuento;

    // Actualizar los campos del producto
    producto.enPromocion = true;
    producto.porcentajeDescuento = porcentajeNum;
    producto.precioConDescuento = precioConDescuento;

    await producto.save();

    res.json({ mensaje: 'Promoción aplicada exitosamente', producto });
  } catch (error) {
    console.error('Error al aplicar promoción:', error);
    res.status(500).json({ error: 'Error al aplicar promoción al producto' });
  }
};



// ✅ Eliminar promoción de un producto
export const eliminarPromocion = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el producto
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Restablecer los campos de promoción
    producto.enPromocion = false;
    producto.porcentajeDescuento = null;
    producto.precioConDescuento = null;

    await producto.save();

    res.json({ mensaje: 'Promoción eliminada exitosamente', producto });
  } catch (error) {
    console.error('Error al eliminar promoción:', error);
    res.status(500).json({ error: 'Error al eliminar promoción del producto' });
  }
};
