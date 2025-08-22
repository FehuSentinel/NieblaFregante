import React, { useEffect, useState } from 'react';
import './SinRifa.css';

export default function SinRifa({ fechaSiguiente }) {
  const [tiempoRestante, setTiempoRestante] = useState('');

  useEffect(() => {
    if (!fechaSiguiente) {
      setTiempoRestante('Sin fecha definida');
      return;
    }

    const fecha = new Date(fechaSiguiente);
    const intervalo = setInterval(() => {
      const ahora = new Date();
      const diferencia = fecha - ahora;

      if (diferencia <= 0) {
        clearInterval(intervalo);
        setTiempoRestante('¡Muy pronto!');
      } else {
        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
        const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
        const segundos = Math.floor((diferencia / 1000) % 60);

        setTiempoRestante(`${dias}d ${horas}h ${minutos}m ${segundos}s`);
      }
    }, 1000);

    return () => clearInterval(intervalo);
  }, [fechaSiguiente]);

  return (
    <div className="sinrifa-fondo">
      <div className="clavo mt-3" />
      <div className="cartel-colgante">
        <h2 className="mensaje-cartel">😔 Sin rifa por ahora...</h2>
        <p className="mensaje-secundario">
          Disculpa, estamos preparando algo especial para ti.
        </p>
        <p className="contador">
          ⏳ Próxima rifa en: <strong>{tiempoRestante}</strong>
        </p>
      </div>
    </div>
  );
}
