import React from 'react';
import './tarjetaagregarproducto.css';

export default function TarjetaAgregarProducto({ onClick }) {
  return (
    <div className="tarjeta-agregar" onClick={onClick}>
      <div className="contenido-agregar">
        <div className="icono-agregar">＋</div>
        <p className="texto-agregar">Nuevo Producto</p>
      </div>
    </div>
  );
}