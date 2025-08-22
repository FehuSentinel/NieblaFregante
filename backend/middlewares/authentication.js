import 'dotenv/config';
import jsonwebtoken from 'jsonwebtoken';
import Usuarios from '../models/usuario.js'; // Importar el modelo de Sequelize

// ✅ Generar un Token JWT
export function generarToken(usuario) {
    return jsonwebtoken.sign(
        { id: usuario.id, email: usuario.email }, // `_id` ya no se usa en PostgreSQL
        process.env.JWT_TOKEN_SECRET,
        { expiresIn: '1h' } // Expira en 1 hora
    );
}

// ✅ Middleware para verificar Token
export async function verificarToken(req, res, next) {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token no proporcionado o formato inválido' });
        }

        const token = authHeader.replace('Bearer ', '').trim();
        const dataToken = jsonwebtoken.verify(token, process.env.JWT_TOKEN_SECRET);
        
        // 🔹 Buscar usuario en PostgreSQL con Sequelize
        const usuario = await Usuarios.findByPk(dataToken.id, {
            attributes: { exclude: ['password'] } // Evitar devolver la contraseña
        });

        if (!usuario) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        if (usuario.estado !== 'activo') {
            return res.status(403).json({ error: 'Usuario inactivo' });
        }

        req.user = usuario; // 🔹 Asigna usuario autenticado a `req.user`
        console.log("🔹 Usuario autenticado:", req.user.toJSON());

        next();
    } catch (error) {
        console.error("🔴 Error en la verificación del token:", error);
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
}


// ✅ Middleware OPCIONAL para verificar Token
export async function verificarTokenOpcional(req, res, next) {
  try {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '').trim();
      const dataToken = jsonwebtoken.verify(token, process.env.JWT_TOKEN_SECRET);

      const usuario = await Usuarios.findByPk(dataToken.id, {
        attributes: { exclude: ['password'] }
      });

      if (usuario && usuario.estado === 'activo') {
        req.user = usuario;
        console.log("🟢 Usuario autenticado opcional:", req.user.toJSON());
      } else {
        console.warn('⚠️ Usuario inválido o inactivo. Se continuará como invitado.');
      }
    }
  } catch (error) {
    console.warn('⚠️ Token inválido (opcional). Continuando como invitado.');
  }

  next(); // Siempre continúa
}
