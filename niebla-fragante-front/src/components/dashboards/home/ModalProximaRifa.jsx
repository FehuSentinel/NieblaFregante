// src/components/Home/ModalProximaRifa.jsx
import React, { useState } from 'react';
import './ModalCrearRifa.css'; // Reutiliza estilos

export default function ModalProximaRifa({ mostrar, onClose }) {
  const [fecha, setFecha] = useState('');

  const handleGuardar = () => {
    if (fecha) {
      console.log('📅 Fecha guardada:', fecha);
      // Aquí puedes hacer un axios.post al backend
    } else {
      console.log('📅 No se programó fecha de próxima rifa');
    }
    onClose();
  };

  if (!mostrar) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-rifa" onClick={(e) => e.stopPropagation()}>
        <button className="cerrar-modal" onClick={onClose}>✖</button>
        <h3 className="mb-3">📅 Agendar Próxima Rifa</h3>

        <input
          type="date"
          className="form-control mb-3"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        <button className="btn btn-primary w-100" onClick={handleGuardar}>
          Guardar
        </button>
      </div>
    </div>
  );
}
