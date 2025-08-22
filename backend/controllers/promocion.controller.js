import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// 🧭 Para obtener __dirname con ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📁 Ruta absoluta a la carpeta de promociones
const rutaPromos = path.join(__dirname, '../uploads/promociones');

// 🌐 URL base para acceder a las imágenes (usa tu .env)
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

/* ──────────────────────────────────────
   📤 Obtener imágenes promocionales
────────────────────────────────────── */
export const obtenerPromos = async (req, res) => {
  try {
    const archivos = await fs.readdir(rutaPromos);

    const promos = archivos.map((nombre) => ({
      nombre,
      url: `${BASE_URL}/uploads/promociones/${nombre}`
    }));

    res.json(promos);
  } catch (error) {
    console.error('❌ Error al obtener promociones:', error);
    res.status(500).json({ error: 'No se pudieron obtener las promociones' });
  }
};

/* ──────────────────────────────────────
   📥 Subir nueva imagen promocional
────────────────────────────────────── */
export const subirPromo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ninguna imagen' });
    }

    res.json({
      mensaje: 'Imagen subida correctamente',
      nombre: req.file.filename,
      url: `${BASE_URL}/uploads/promociones/${req.file.filename}`
    });
  } catch (error) {
    console.error('❌ Error al subir imagen:', error);
    res.status(500).json({ error: 'Error al subir la imagen' });
  }
};

/* ──────────────────────────────────────
   🗑 Eliminar imagen promocional
────────────────────────────────────── */
export const eliminarPromo = async (req, res) => {
  try {
    const { nombre } = req.params;
    const rutaArchivo = path.join(rutaPromos, nombre);

    const existe = await fs.pathExists(rutaArchivo);

    if (!existe) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    await fs.unlink(rutaArchivo);

    res.json({ mensaje: 'Imagen eliminada correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar imagen:', error);
    res.status(500).json({ error: 'Error al eliminar la imagen' });
  }
};
