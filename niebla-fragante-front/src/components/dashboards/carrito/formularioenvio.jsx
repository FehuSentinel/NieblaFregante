import React, { useEffect, useState } from 'react';
import './formularioenvio.css';

export default function FormularioEnvio({ visible, onClose, onDireccionIngresada }) {
  const [calle, setCalle] = useState('');
  const [numero, setNumero] = useState('');
  const [depto, setDepto] = useState('');
  const [comentario, setComentario] = useState('');
  const [ciudades, setCiudades] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [idCiudad, setIdCiudad] = useState('');
  const [idComuna, setIdComuna] = useState('');

  const handleClickFondo = (e) => {
    if (e.target.classList.contains('formulario-envio-overlay')) {
      onClose();
    }
  };

  useEffect(() => {
    const fetchCiudades = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/ciudades`);
        const data = await res.json();
        setCiudades(data);
      } catch (error) {
        console.error('Error al cargar ciudades:', error);
      }
    };
    fetchCiudades();
  }, []);

  useEffect(() => {
    const fetchComunas = async () => {
      if (idCiudad) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/ciudades/${idCiudad}/comunas`);
          const data = await res.json();
          setComunas(data);
        } catch (error) {
          console.error('Error al cargar comunas:', error);
        }
      } else {
        setComunas([]);
      }
    };
    fetchComunas();
  }, [idCiudad]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const direccion = {
      calle,
      numero,
      depto,
      comentario,
      id_ciudad: idCiudad,
      id_comuna: idComuna,
      ciudad: ciudades.find(c => c.idCiudad === parseInt(idCiudad))?.nombre || '',
      comuna: comunas.find(c => c.idComuna === parseInt(idComuna))?.nombre || '',
    };

    if (onDireccionIngresada) {
      onDireccionIngresada(direccion);
    }

    onClose();
  };

  return (
    <div
      className="formulario-envio-overlay"
      onClick={handleClickFondo}
      style={{ display: visible ? 'flex' : 'none' }}
    >
      <div className="formulario-envio-modal">
        <button className="cerrar-modal" onClick={onClose}>✕</button>
        <h3>Formulario de Envío</h3>

        <form onSubmit={handleSubmit} className="formulario-envio">
          <input
            type="text"
            placeholder="Calle"
            value={calle}
            onChange={(e) => setCalle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Número"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Departamento (opcional)"
            value={depto}
            onChange={(e) => setDepto(e.target.value)}
          />

          <select
            value={idCiudad}
            onChange={(e) => setIdCiudad(e.target.value)}
            required
          >
            <option value="">Selecciona una ciudad</option>
            {ciudades
              .filter((ciudad) => ciudad.nombre === 'Santiago')
              .map((ciudad) => (
                <option key={ciudad.idCiudad} value={ciudad.idCiudad}>
                  {ciudad.nombre}
                </option>
              ))}
          </select>

          <select
            value={idComuna}
            onChange={(e) => setIdComuna(e.target.value)}
            required
          >
            <option value="">Selecciona una comuna</option>
            {comunas.map((comuna) => (
              <option key={comuna.idComuna} value={comuna.idComuna}>
                {comuna.nombre}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Comentario adicional (opcional)"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />

          <button type="submit" className="pagar">Guardar dirección</button>
        </form>
      </div>
    </div>
  );
}
