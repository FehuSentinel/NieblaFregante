import React, { useEffect, useState } from 'react';
import './HighlightRifa.css';
import confetti from 'canvas-confetti';

export default function HighlightRifa({ totalNumeros, numerosVendidos, ganador }) {
  const [numeroActual, setNumeroActual] = useState(null);
  const [finalizado, setFinalizado] = useState(false);
  const [parpadeo, setParpadeo] = useState(false);

  // Evitar render si falta data crítica
  if (!totalNumeros || !Array.isArray(numerosVendidos) || !ganador) {
    return (
      <div className="text-center py-5">
        <h3>🎲 Preparando sorteo...</h3>
      </div>
    );
  }

  // Números no vendidos para mostrar con X
  const numerosNoVendidos = Array.from({ length: totalNumeros }, (_, i) => i + 1).filter(
    (n) => !numerosVendidos.includes(n)
  );

  // Simular animación de sorteo
  useEffect(() => {
    if (!ganador || numerosVendidos.length === 0) return;

    let index = 0;
    const intervalo = setInterval(() => {
      setNumeroActual(numerosVendidos[index]);
      index = (index + 1) % numerosVendidos.length;

      if (numerosVendidos[index] === ganador.numero) {
        clearInterval(intervalo);
        setTimeout(() => {
          setNumeroActual(ganador.numero);
          setParpadeo(true);
          setTimeout(() => {
            setFinalizado(true);
            setParpadeo(false);
            confetti({
              particleCount: 200,
              spread: 160,
              origin: { y: 0.6 },
            });
          }, 2000);
        }, 300);
      }
    }, 100);

    return () => clearInterval(intervalo);
  }, [ganador, numerosVendidos]);

  return (
    <div className="highlight-container">
      <h2 className="text-center mb-4">Resultado del Sorteo</h2>

      <div className="calendario-grid">
        {Array.from({ length: totalNumeros }, (_, i) => {
          const num = i + 1;
          const vendido = numerosVendidos.includes(num);
          const actual = num === numeroActual;
          const clase = vendido ? 'vendido' : 'no-vendido';

          return (
            <div
              key={num}
              className={`numero-celda ${clase} ${actual ? 'resaltado' : ''} ${parpadeo && num === ganador.numero ? 'parpadeo' : ''}`}
            >
              {vendido ? num : '✖'}
            </div>
          );
        })}
      </div>

      {finalizado && (
        <div className="ganador-banner">
          <h1>🎉 ¡{ganador.nombre} ha ganado! 🎉</h1>
          <h2>Número: {ganador.numero}</h2>
          <p className="correo-pequeno">{ganador.correo}</p>
        </div>
      )}
    </div>
  );
}
