import React from 'react';
import './cardproductorifa.css';

export default function CardProductoRifa({ producto }) {
  const estaAgotado = producto.stock <= 0;

  return (
    <div className={`card-rifa ${estaAgotado ? 'agotado' : ''}`}>


      {estaAgotado && <div className="overlay-agotado-rifa">AGOTADO</div>}

      <img
        src={`${import.meta.env.VITE_MEDIA_URL}/uploads/images/${producto.imagenUrl}`}
        alt={producto.nombre}
        className="img-rifa"
      />

      <div className="cuerpo-rifa">
        <h3 className="titulo-rifa">{producto.nombre}</h3>
        <p className="ml-rifa"><strong>Marca:</strong> {producto.marca}</p>
        <p className="ml-rifa"><strong>Mililitros:</strong> {producto.ml}ml</p>
        <p className="categoria-rifa"><strong>Categoría:</strong> {producto.categoria?.nombre || 'Sin categoría'}</p>
      
      </div>
    </div>
  );
}
