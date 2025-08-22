import React, { useState, useEffect } from 'react';
import { useCarritoRifa } from '../../../context/CarritoRifaContext';
import DetalleCarritoRifa from './detallecarritorifa';
import './carritorifa.css';
import { useNavigate } from 'react-router-dom';


export default function CarritoFlotanteRifa({ modoPanel = false }) {
  const { rifas, totalRifas, numerosSeleccionados } = useCarritoRifa();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarPanelMovil, setMostrarPanelMovil] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(null);

  // Calcular tiempo restante
  useEffect(() => {
    if (numerosSeleccionados.length === 0) {
      setTiempoRestante(null);
      return;
    }

    const primerNumero = [...numerosSeleccionados]
      .sort((a, b) => new Date(a.fechaReserva) - new Date(b.fechaReserva))[0];

    const expiracion = new Date(new Date(primerNumero.fechaReserva).getTime() + 5 * 60 * 1000);

    const actualizarTiempo = () => {
      const ahora = new Date();
      const diferencia = expiracion - ahora;

      if (diferencia <= 0) {
        setTiempoRestante({ minutos: 0, segundos: 0, expirado: true });
        return;
      }

      const minutos = Math.floor(diferencia / 60000);
      const segundos = Math.floor((diferencia % 60000) / 1000);

      setTiempoRestante({ minutos, segundos, expirado: false });
    };

    actualizarTiempo();
    const interval = setInterval(actualizarTiempo, 1000);
    return () => clearInterval(interval);
  }, [numerosSeleccionados]);

  return (
    <>
      {/* 📱 Botón para abrir panel (solo si no está en modoPanel y es móvil) */}
      {!modoPanel && (
        <div className="carrito-boton-movil d-md-none mt-3 text-center">
          <button
            className="btn-agregar-desc"
            onClick={() => setMostrarPanelMovil(true)}
          >
            Ver carrito de rifas
          </button>
        </div>
      )}

      {/* 🧾 Panel móvil propio (si no se usa modoPanel externo) */}
      {!modoPanel && mostrarPanelMovil && (
        <div className="slide-panel">
          <button className="cerrar-panel" onClick={() => setMostrarPanelMovil(false)}>✖</button>
          <CarritoFlotanteRifa modoPanel={true} />
        </div>
      )}

      {/* 🖥️ Carrito visible en escritorio o panel externo */}
      <div className={`carrito-rifa-flotante ${modoPanel ? '' : 'd-none d-md-block'}`}>
        <div className="contenido-carrito">
          <h4>🎟️ Números Seleccionados</h4>

          {totalRifas === 0 ? (
            <p>No has seleccionado ningún número todavía.</p>
          ) : (
            rifas.map((r) => (
              <div key={r.id} className="grupo-rifa">
                <p><strong>{r.id}</strong></p>
                <div className="numeros-scroll">
                  {r.numeros.map((n, i) => (
                    <span key={i} className="numero-rifa-chip">{n}</span>
                  ))}
                </div>
              </div>
            ))
          )}

          {tiempoRestante && !tiempoRestante.expirado && (
            <div className="cuenta-regresiva">
              ⏳ Tiempo restante: {tiempoRestante.minutos}m {tiempoRestante.segundos}s
            </div>
          )}

          {totalRifas > 0 && (
<button className="btn-confirmar-carrito" onClick={() => navigate('/detallecarritorifa')}>
  Confirmar y Pagar ({totalRifas})
</button>

          )}
        </div>
      </div>

    </>
  );
}
