import React, { useContext } from 'react';
import { useCarritoRifa } from '../../../context/CarritoRifaContext';
import { AuthContext } from '../../../context/authcontext';
import './detallecarritorifa.css';
import { useNavigate } from 'react-router-dom';

export default function DetalleCarritoRifaDashboard() {
  const { numerosSeleccionados, rifas } = useCarritoRifa();
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  // Filtrar duplicados por número y rifa
  const numerosUnicos = [
    ...new Map(numerosSeleccionados.map(n => [`${n.numero}-${n.rifaId}`, n])).values()
  ];

  // Obtener precios reales por rifa
  const preciosPorRifa = numerosUnicos.reduce((acc, n) => {
    const rifa = rifas.find(r => r.id === n.rifaId);
    const precio = rifa?.precioNumero || 1000;
    acc[n.rifaId] = precio;
    return acc;
  }, {});

  const total = numerosUnicos.reduce((acc, n) => {
    const precio = preciosPorRifa[n.rifaId] || 1000;
    return acc + precio;
  }, 0);

  const carritoIds = [...new Set(numerosUnicos.map(n => n.idNumero).filter(Boolean))];

  const iniciarPago = async () => {
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_URL;

    let id_usuario = null;
    if (usuario?.id) {
      id_usuario = Number(usuario.id);
    } else {
      const idLS = localStorage.getItem('id_usuario');
      id_usuario = idLS ? Number(idLS) : null;
    }

    if (!id_usuario || isNaN(id_usuario)) {
      alert('Usuario no autenticado');
      return;
    }

    if (carritoIds.length === 0) {
      alert('No hay números seleccionados para pagar.');
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/pago/rifa/crear-transaccion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id_usuario })
      });

      const data = await res.json();

      if (data.token && data.url) {
        localStorage.setItem('id_usuario', id_usuario);
        localStorage.setItem('carritoRifa', JSON.stringify(numerosUnicos));
        window.location.href = `${data.url}?token_ws=${data.token}`;
      } else {
        alert('No se pudo iniciar la transacción');
      }
    } catch (error) {
      console.error('❌ Error al iniciar pago de rifa:', error);
      alert('Error al procesar el pago');
    }
  };

  return (
    <div className="dashboard-rifa container mt-5">
      <h2 className="mb-4">🎟️ Números Seleccionados</h2>

      {numerosUnicos.length === 0 ? (
        <p>No has seleccionado ningún número todavía.</p>
      ) : (
        <div className="lista-numeros-dashboard mb-4">
          {numerosUnicos.map((n) => (
            <div key={`${n.numero}-${n.rifaId}`} className="numero-rifa-dashboard">
              N° {n.numero} (Rifa: {n.rifaId}) – ${
                (preciosPorRifa[n.rifaId] || 1000).toLocaleString('es-CL')
              }
            </div>
          ))}
        </div>
      )}

      <h4 className="mb-3">Total a pagar: ${total.toLocaleString('es-CL')}</h4>

      <div className="acciones-dashboard">
        <button className="btn btn-secondary me-3" onClick={() => navigate(-1)}>Volver</button>
        <button className="btn btn-primary" onClick={iniciarPago}>Pagar ahora</button>
      </div>
    </div>
  );
}
