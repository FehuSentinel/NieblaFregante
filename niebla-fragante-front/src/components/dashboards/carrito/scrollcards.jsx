import React from 'react';
import './scrollcards.css';
import CardCarrito from './CardCarrito';
import '../tienda/cardproducto.css';

export default function ScrollCards({ productos }) {
  return (
    <div className="scrollcards-contenedor">
      {productos.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <div className="scrollcards-horizontal">
          {productos.map((producto) => (
            <CardCarrito key={producto.idProducto} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
}
