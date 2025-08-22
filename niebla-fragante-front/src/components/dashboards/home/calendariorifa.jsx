import React, { useContext } from 'react';
import './calendariorifa.css';
import { useCarritoRifa } from '../../../context/CarritoRifaContext';
import { AuthContext } from '../../../context/authcontext';

export default function CalendarioRifa({ rifa }) {
  const {
    numerosSeleccionados,
    agregarNumeroRifa,
    eliminarNumeroRifa
  } = useCarritoRifa();

  const { usuario } = useContext(AuthContext);

  const seleccionados = numerosSeleccionados.filter(n => n.rifaId === rifa.id);
  const carrito = seleccionados.map(n => n.numero);

  const toggleNumero = (numero) => {
    const idNumero = rifa.numerosConId?.find(n => n.numero === numero)?.idNumero;

    if (
      rifa.numerosVendidos.includes(numero) ||
      rifa.numerosReservados?.includes(numero) ||
      !idNumero
    ) return;

    if (carrito.includes(numero)) {
      eliminarNumeroRifa(numero, rifa.id);
    } else {
      agregarNumeroRifa(numero, rifa.id, idNumero);
    }
  };

  return (
    <div className="calendario-rifa">
      <h2  className="titulo-rifa"> <span className="fuego">🔥</span> {rifa.nombre} <span className="fuego">🔥</span></h2>
      <p className="info-rifa">
        {rifa.numerosVendidos.length} / {rifa.totalNumeros} vendidos
      </p>
      <p className="info-rifa">Sorteo: {rifa.fechaSorteo}</p>
      <p className="info-rifa">Precio por número: ${rifa.precioNumero}</p>

      <div className="grilla-numeros">
        {Array.from({ length: rifa.totalNumeros }, (_, i) => {
          const numero = i + 1;
          const vendido = rifa.numerosVendidos.includes(numero);
          const reservado = rifa.numerosReservados?.includes(numero);
          const seleccionado = carrito.includes(numero);

          return (
            <div
              key={numero}
              className={`numero-rifa ${vendido ? 'vendido' : reservado ? 'reservado' : ''} ${seleccionado ? 'seleccionado' : ''}`}
              onClick={() => toggleNumero(numero)}
            >
              {vendido ? '✖' : reservado ? '●' : numero}
            </div>
          );
        })}
      </div>
    </div>
  );
}
