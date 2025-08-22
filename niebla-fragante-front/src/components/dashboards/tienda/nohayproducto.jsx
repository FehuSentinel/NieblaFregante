import React from 'react';
import './nohayproducto.css';

export default function NoHayProducto() {
  return (
    <div className="no-productos-container">
      <div className="no-productos-card">
        <i className="bi bi-box-seam icono-sin-productos"></i>
        <h3>Sin productos disponibles</h3>
        <p>Aún no se han agregado productos a la tienda.</p>
      </div>
    </div>
  );
}
