import React, { useState } from 'react';
import axios from 'axios';
import ModalCrearRifa from './ModalCrearRifa';
import ModalProximaRifa from './ModalProximaRifa';
import './PanelRifa.css';

export default function PanelRifa({ onLanzar }) {
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [mostrarProxima, setMostrarProxima] = useState(false);
  const [rifaSeleccionada, setRifaSeleccionada] = useState(null);

  // ✅ Crear nueva rifa
  const abrirCrearRifa = () => {
    setRifaSeleccionada(null);
    setMostrarCrear(true);
  };

  // ✅ Editar rifa activa
  const editarRifa = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/rifas/activa`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.rifa) {
        setRifaSeleccionada(res.data.rifa);
        setMostrarEditar(true);
      } else {
        alert('No hay rifa activa para editar.');
      }
    } catch (err) {
      console.error('Error al obtener rifa activa para editar', err);
      alert('Error al intentar editar la rifa.');
    }
  };

  // ✅ Desactivar rifa activa
  const desactivarRifa = async () => {
    if (!confirm('¿Estás seguro de que quieres DESACTIVAR la rifa actual?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${import.meta.env.VITE_API_URL}/rifas/activa`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Rifa desactivada correctamente');
      window.location.reload();
    } catch (err) {
      console.error('Error al desactivar rifa', err);
      alert('No se pudo desactivar la rifa');
    }
  };

  return (
    <section className="home-section">
      <div className="container rifacont text-center">
        <h2 className="section-title">🎛 Panel de Rifa</h2>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <button className="btn btn-success" onClick={abrirCrearRifa}>Crear Rifa</button>
          <button className="btn btn-primary" onClick={editarRifa}>Editar Rifa</button>
          <button className="btn btn-danger" onClick={desactivarRifa}>Desactivar Rifa</button>
          <button className="btn btn-warning" onClick={onLanzar}>Lanzar Rifa</button>
          <button className="btn btn-outline-secondary" onClick={() => setMostrarProxima(true)}>
            📅 Agendar Próxima Rifa
          </button>
        </div>
      </div>

      {/* Modal para crear nueva rifa */}
      {mostrarCrear && (
        <ModalCrearRifa
          mostrar={true}
          onClose={() => setMostrarCrear(false)}
          onRifaCreada={() => {
            setMostrarCrear(false);
            window.location.reload();
          }}
        />
      )}

      {/* Modal para editar rifa existente */}
      {mostrarEditar && (
        <ModalCrearRifa
          mostrar={true}
          rifaExistente={rifaSeleccionada}
          onClose={() => setMostrarEditar(false)}
          onRifaCreada={() => {
            setMostrarEditar(false);
            window.location.reload();
          }}
        />
      )}

      {/* Modal para agendar próxima rifa */}
      <ModalProximaRifa
        mostrar={mostrarProxima}
        onClose={() => setMostrarProxima(false)}
      />
    </section>
  );
}
