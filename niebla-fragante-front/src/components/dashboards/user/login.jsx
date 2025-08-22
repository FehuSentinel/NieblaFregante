import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../../../context/authcontext';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setpassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        correo: correo.trim(),
        password: password.trim(),
      });

      const data = response.data;
      

      if (data.token && data.usuario) {
      
        localStorage.clear(); 

        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));

      
        login(data.usuario, data.token); // Pasar el token al contexto
        navigate('/');
      }else {
        setError('Credenciales incorrectas');
      }
    } catch (err) {
      console.error('Error en login:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Error al iniciar sesión. Verifica tus datos.');
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google-token`, {
        token: credential,
      });

      const data = response.data;
      login(data.usuario, data.token); // Pasar el token al contexto
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (error) {
      console.error('Error con login de Google', error);
      setError('Error al iniciar sesión con Google.');
    }
  };

  const handleGoogleFailure = () => {
    setError('No se pudo iniciar sesión con Google.');
  };

  return (
    <div className="login-container">
      <form className="login-form glassy-bg" onSubmit={handleLogin}>
        <h2 className="mb-4">Iniciar Sesión</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label htmlFor="correo" className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            id="correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn nav-btn w-100 mb-3">
          Iniciar sesión
        </button>

        <div className="text-center mb-2 text-muted">
          ¿No tienes cuenta? <a href="/registro" className="enlace-inscribirse">Inscríbete</a>
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
