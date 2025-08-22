import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import Usuario from '../models/usuario.js';
import Cliente from '../models/cliente.js';
import { enviarCorreoRecuperacion } from '../utils/correo.js';
import { OAuth2Client } from 'google-auth-library';




// ✅ Script inicial para crear admin (bórralo después de ejecutarlo)
import Trabajador from '../models/trabajador.js';
export const crearAdminInicial = async () => {
  try {
    const existeAdmin = await Usuario.findOne({ where: { correo: process.env.ADMIN_CORREO } });
    if (existeAdmin) {
      console.log('🟡 Admin ya existe, no se creará de nuevo.');
      return;
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

    const adminUsuario = await Usuario.create({
      nombre: process.env.ADMIN_NOMBRE,
      apellido: process.env.ADMIN_APELLIDO,
      correo: process.env.ADMIN_CORREO,
      password: hashedPassword,
      direccion: null,
      telefono: null,
      estado: 'activo'
    });

    await Trabajador.create({
      idTrabajador: adminUsuario.id_usuario, 
      cargo: process.env.ADMIN_CARGO
    });

    console.log('✅ Admin creado con éxito');
  } catch (error) {
    console.error('❌ Error al crear el admin:', error);
  }
};



// ✅ Registro de cliente
export const registrarCliente = async (req, res) => {
  try {
    const { nombre, apellido, correo, password } = req.body;

    const existe = await Usuario.findOne({ where: { correo } });
    if (existe) return res.status(400).json({ error: 'Correo ya registrado' });

    const hashed = await bcrypt.hash(password, 12);

    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      correo,
      password: hashed,
      direccion: null,
      telefono: null,
      estado: 'activo'
    });

    await Cliente.create({
      idCliente: nuevoUsuario.id_usuario
    });

    // 🔐 Generar token y asignar tipo
    const tipoCliente = process.env.TIPO_CLIENTE;
    const token = jsonwebtoken.sign(
      { id: nuevoUsuario.id_usuario, correo: nuevoUsuario.correo },
      process.env.JWT_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    await nuevoUsuario.update({ token_jwt: token });

    res.status(201).json({
      token,
      usuario: {
        id: nuevoUsuario.id_usuario,
        correo: nuevoUsuario.correo,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        tipo: tipoCliente // normalmente "a"
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar cliente' });
  }
};

// ✅ Login para todos los usuarios
export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) return res.status(400).json({ error: 'Correo o contraseña incorrectos' });

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) return res.status(400).json({ error: 'Correo o contraseña incorrectos' });

    const tipoCliente = process.env.TIPO_CLIENTE;
    const tipoTrabajador = process.env.TIPO_TRABAJADOR;

    let tipo = tipoCliente;
    const trabajador = await Trabajador.findOne({ where: { idTrabajador: usuario.id_usuario } });
    if (trabajador) tipo = tipoTrabajador;

    // 🔐 Generar nuevo token y eliminar el anterior (por seguridad)
    const token = jsonwebtoken.sign(
      { id: usuario.id_usuario, correo: usuario.correo },
      process.env.JWT_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    await usuario.update({ token_jwt: token });

    res.json({
      token,
      usuario: {
        id: usuario.id_usuario,
        correo: usuario.correo,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        tipo // a o b según el entorno
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// ✅ Recuperar contraseña (envía token por correo)
export const recuperarPassword = async (req, res) => {
  try {
    const { correo } = req.body;
    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) return res.status(404).json({ error: 'Correo no registrado' });

    const token = uuidv4();
    const expiracion = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    await usuario.update({ token_recuperacion: token, expiracion_token: expiracion });

    await enviarCorreoRecuperacion({ correo, nombre: usuario.nombre, token });
    res.json({ mensaje: 'Correo de recuperación enviado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar recuperación' });
  }
};

// ✅ Reestablecer contraseña usando token
export const reestablecerPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { nuevaPassword } = req.body;

    const usuario = await Usuario.findOne({
      where: {
        token_recuperacion: token,
        expiracion_token: { [Op.gt]: new Date() }
      }
    });

    if (!usuario) return res.status(400).json({ error: 'Token inválido o expirado' });

    const hashed = await bcrypt.hash(nuevaPassword, 10);
    await usuario.update({
      password: hashed,
      token_recuperacion: null,
      expiracion_token: null
    });

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar contraseña' });
  }
};

// ✅ Actualizar perfil del usuario logueado
export const actualizarPerfil = async (req, res) => {
  try {
    const id = req.user.id_usuario;
    const { nombre, apellido, correo, telefono, direccion } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    await usuario.update({ nombre, apellido, correo, telefono, direccion });

    res.json({ mensaje: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};

// ✅ Obtener datos del usuario actual
export const obtenerUsuarioActual = async (req, res) => {
  try {
    const id = req.user.id_usuario;
    const usuario = await Usuario.findByPk(id, {
      attributes: ['id_usuario', 'nombre', 'apellido', 'correo', 'telefono', 'direccion', 'fechaCreacion']
    });

    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener datos del usuario' });
  }
};




const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const loginConGoogleToken = async (req, res) => {
  const { token: id_token } = req.body; // 👈 asegúrate que sea "token", no "id_token"

  try {
    console.log('🔑 ID Token recibido:', id_token?.substring(0, 30)); // para no loguear todo

    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const nombre = payload.name;
    const apellido = payload.family_name || ''; // opcional

    console.log('🧾 Payload:', payload);

    let usuario = await Usuario.findOne({ where: { correo: email } });

    if (!usuario) {
      usuario = await Usuario.create({
        nombre,
        apellido,
        correo: email,
        password: null,
        autenticadoPor: 'google',
        estado: 'activo'
      });

      await Cliente.create({ idCliente: usuario.id_usuario });
      console.log('🆕 Usuario creado con Google:', usuario.correo);
    } else {
      console.log('✅ Usuario existente con Google:', usuario.correo);
    }

    const token = jsonwebtoken.sign(
      { id: usuario.id_usuario, correo: usuario.correo },
      process.env.JWT_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id_usuario,
        correo: usuario.correo,
        nombre: usuario.nombre,
        apellido: usuario.apellido || '',
        tipo: 'a' // Puedes detectar si es admin después
      }
    });
  } catch (error) {
    console.error('❌ Error en loginConGoogleToken:', error.message);
console.log('📨 ID_TOKEN recibido:', id_token?.slice(0, 30), '...');
console.log('🎯 CLIENT_ID esperado:', process.env.GOOGLE_CLIENT_ID);

    res.status(401).json({ error: 'Token inválido de Google', detalle: error.message });
  }
};







