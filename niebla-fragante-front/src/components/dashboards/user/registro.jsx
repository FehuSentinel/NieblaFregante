import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import './registro.css';
import { AuthContext } from '../../../context/authcontext';

export default function Registro() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/registro`, form);
      const { token, usuario } = response.data;

      login(usuario, token);
      localStorage.setItem('token', token);
      setMensaje('Registro exitoso. Redirigiendo...');

      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google-token`, {
        token: credential,
      });

      const data = response.data;
      login(data.usuario, data.token);
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (error) {
      console.error('Error con login de Google', error);
      setError('Error al registrarse con Google.');
    }
  };

  const handleGoogleFailure = () => {
    setError('No se pudo registrar con Google.');
  };

  return (
    <div className="registro-container">
      <form className="registro-form glassy-bg" onSubmit={handleSubmit}>
        <h2 className="mb-4">Crear Cuenta</h2>

        {mensaje && <div className="alert alert-success">{mensaje}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label className="form-label">Apellido</label>
          <input name="apellido" value={form.apellido} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input type="email" name="correo" value={form.correo} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" required />
        </div>

        <button type="submit" className="btn nav-btn w-100 mb-3">Registrarse</button>

        <div className="text-center mb-2 text-muted">
          ¿Ya tienes cuenta? <button type="button" className="btn btn-link p-0" onClick={() => navigate('/login')}>Inicia sesión</button>
        </div>

        <div className="text-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            useOneTap
          />
        </div>
      </form>
    </div>
  );
}
