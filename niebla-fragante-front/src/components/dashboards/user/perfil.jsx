import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../context/authcontext';
import './perfil.css';

export default function Perfil() {
  const { usuario, token, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('perfil');
  const [pedidos, setPedidos] = useState([]);
  const [boletas, setBoletas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [datosUsuario, setDatosUsuario] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    direccion: ''
  });

  useEffect(() => {
    console.log('🔍 Perfil useEffect - usuario:', usuario);
    console.log('🔍 Perfil useEffect - token:', token);
    
    // Verificar si hay usuario y token
    if (!usuario || !token) {
      console.log('❌ No hay usuario o token, redirigiendo a login');
      navigate('/login');
      return;
    }
    console.log('✅ Usuario y token encontrados, cargando datos');
    
    // Por ahora, usar los datos del contexto en lugar de cargar desde la API
    setDatosUsuario(usuario);
    setFormData({
      nombre: usuario.nombre || '',
      apellido: usuario.apellido || '',
      correo: usuario.correo || '',
      telefono: usuario.telefono || '',
      direccion: usuario.direccion || ''
    });
    
    // cargarDatosUsuario();
    cargarDatos();
  }, [usuario, token, navigate]);

  const cargarDatosUsuario = async () => {
    try {
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/usuarios/perfil`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setDatosUsuario(response.data);
      setFormData({
        nombre: response.data.nombre || '',
        apellido: response.data.apellido || '',
        correo: response.data.correo || '',
        telefono: response.data.telefono || '',
        direccion: response.data.direccion || ''
      });
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      if (error.response?.status === 401) {
        // Token expirado o inválido
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/login');
        return;
      }
      setMensaje('Error al cargar los datos del usuario');
    }
  };

  const cargarDatos = async () => {
    setLoading(true);
    try {
      if (!token) {
        navigate('/login');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const pedidosResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/pedidos/usuario`,
        { headers }
      );
      setPedidos(pedidosResponse.data);

      const boletasResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/boletas/usuario`,
        { headers }
      );
      setBoletas(boletasResponse.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      if (error.response?.status === 401) {
        // Token expirado o inválido
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/login');
        return;
      }
      setMensaje('Error al cargar los datos del perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const guardarPerfil = async () => {
    try {
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/usuarios/perfil`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Recargar datos del usuario
      await cargarDatosUsuario();

      setEditando(false);
      setMensaje('Perfil actualizado correctamente');
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      if (error.response?.status === 401) {
        // Token expirado o inválido
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/login');
        return;
      }
      setMensaje('Error al actualizar el perfil');
    }
  };

  const descargarBoleta = async (idBoleta) => {
    try {
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/boletas/${idBoleta}/pdf`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `boleta-${idBoleta}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error al descargar boleta:', error);
      if (error.response?.status === 401) {
        // Token expirado o inválido
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/login');
        return;
      }
      setMensaje('Error al descargar la boleta');
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  // Función para obtener las boletas asociadas a un pedido
  const obtenerBoletasDePedido = (idPedido) => {
    return boletas.filter(boleta => boleta.idPedido === idPedido);
  };

  // Mostrar loading mientras se verifica la autenticación
  if (!usuario || !token) {
    return <div className="loading">Verificando autenticación...</div>;
  }

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <h1>Mi Perfil</h1>
        <p>Bienvenido, {datosUsuario?.nombre || usuario.nombre} {datosUsuario?.apellido || usuario.apellido}</p>
      </div>

      {mensaje && (
        <div className={`mensaje ${mensaje.includes('Error') ? 'error' : 'exito'}`}>
          {mensaje}
        </div>
      )}

      <div className="perfil-tabs">
        <button 
          className={`tab-btn ${activeTab === 'perfil' ? 'active' : ''}`}
          onClick={() => setActiveTab('perfil')}
        >
          <i className="bi bi-person-circle"></i>
          Datos Personales
        </button>
        <button 
          className={`tab-btn ${activeTab === 'compras' ? 'active' : ''}`}
          onClick={() => setActiveTab('compras')}
        >
          <i className="bi bi-bag-check"></i>
          Mis Compras
        </button>
      </div>

      <div className="perfil-content">
        {activeTab === 'perfil' && (
          <div className="perfil-seccion">
            <div className="perfil-header-seccion">
              <h2>Información Personal</h2>
              {!editando && (
                <button 
                  className="btn-editar"
                  onClick={() => setEditando(true)}
                >
                  <i className="bi bi-pencil"></i>
                  Editar
                </button>
              )}
            </div>

            {editando ? (
              <div className="formulario-edicion">
                <div className="form-group">
                  <label>Nombre:</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Apellido:</label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Correo:</label>
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Teléfono:</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Dirección:</label>
                  <textarea
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    className="form-input"
                    rows="3"
                  />
                </div>

                <div className="form-actions">
                  <button 
                    className="btn-guardar"
                    onClick={guardarPerfil}
                  >
                    <i className="bi bi-check-lg"></i>
                    Guardar
                  </button>
                  <button 
                    className="btn-cancelar"
                    onClick={() => {
                      setEditando(false);
                      setFormData({
                        nombre: datosUsuario?.nombre || '',
                        apellido: datosUsuario?.apellido || '',
                        correo: datosUsuario?.correo || '',
                        telefono: datosUsuario?.telefono || '',
                        direccion: datosUsuario?.direccion || ''
                      });
                    }}
                  >
                    <i className="bi bi-x-lg"></i>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="info-perfil">
                <div className="info-item">
                  <strong>Nombre:</strong>
                  <span>{datosUsuario?.nombre || 'No especificado'} {datosUsuario?.apellido || ''}</span>
                </div>
                <div className="info-item">
                  <strong>Correo:</strong>
                  <span>{datosUsuario?.correo || 'No especificado'}</span>
                </div>
                <div className="info-item">
                  <strong>Teléfono:</strong>
                  <span>{datosUsuario?.telefono || 'No especificado'}</span>
                </div>
                <div className="info-item">
                  <strong>Dirección:</strong>
                  <span>{datosUsuario?.direccion || 'No especificada'}</span>
                </div>
                <div className="info-item">
                  <strong>Miembro desde:</strong>
                  <span>{datosUsuario?.fechaCreacion ? formatearFecha(datosUsuario.fechaCreacion) : 'No disponible'}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'compras' && (
          <div className="perfil-seccion">
            <h2>Historial de Compras</h2>
            {loading ? (
              <div className="loading">Cargando compras...</div>
            ) : pedidos.length === 0 ? (
              <div className="sin-datos">
                <i className="bi bi-bag-x"></i>
                <p>No tienes compras registradas</p>
              </div>
            ) : (
              <div className="lista-compras">
                {pedidos.map((pedido) => {
                  const boletasDelPedido = obtenerBoletasDePedido(pedido.idPedido);
                  
                  return (
                    <div key={pedido.idPedido} className="compra-item">
                      <div className="compra-header">
                        <h3>Pedido #{pedido.idPedido}</h3>
                        <span className={`estado ${pedido.estado.toLowerCase()}`}>
                          {pedido.estado}
                        </span>
                      </div>
                      <div className="compra-info">
                        <p><strong>Fecha:</strong> {formatearFecha(pedido.fechaPedido)}</p>
                        <p><strong>Total:</strong> {formatearPrecio(pedido.total)}</p>
                        {pedido.comentario && (
                          <p><strong>Comentario:</strong> {pedido.comentario}</p>
                        )}
                      </div>
                      
                      {/* Sección de boletas del pedido */}
                      {boletasDelPedido.length > 0 ? (
                        <div className="boletas-pedido">
                          <h4>Boletas del pedido:</h4>
                          <div className="lista-boletas-pedido">
                            {boletasDelPedido.map((boleta) => (
                              <div key={boleta.idBoleta} className="boleta-pedido-item">
                                <div className="boleta-pedido-info">
                                  <span><strong>Boleta #{boleta.idBoleta}</strong></span>
                                  <span>Fecha: {formatearFecha(boleta.fechaEmision)}</span>
                                  <span>Total: {formatearPrecio(boleta.total)}</span>
                                </div>
                                <button 
                                  className="btn-descargar-pequeno"
                                  onClick={() => descargarBoleta(boleta.idBoleta)}
                                  title="Descargar PDF"
                                >
                                  <i className="bi bi-download"></i>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="sin-boletas">
                          <p><i className="bi bi-info-circle"></i> No hay boletas disponibles para este pedido</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
