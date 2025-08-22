import React, { useEffect } from 'react';
import CardProducto from './cardproducto';
import './gridproductos.css';

export default function GridProductos({
  productos,
  esAdmin,
  onUpdate,
  onAgregarProducto,
  onEditarProducto,
  onRenderizado
}) {
  useEffect(() => {
    if (typeof onRenderizado !== 'function') return;

    const imagenes = Array.from(document.querySelectorAll('.card-producto img'));
    if (imagenes.length === 0) {
      onRenderizado(); // No hay imágenes que esperar
      return;
    }

    let cargadas = 0;
    imagenes.forEach((img) => {
      if (img.complete) {
        cargadas++;
        if (cargadas === imagenes.length) onRenderizado();
      } else {
        img.addEventListener('load', () => {
          cargadas++;
          if (cargadas === imagenes.length) onRenderizado();
        });
        img.addEventListener('error', () => {
          cargadas++;
          if (cargadas === imagenes.length) onRenderizado();
        });
      }
    });
  }, [productos]);

  return (
    <div className="row g-3">
      {esAdmin && (
        <div className="col-12 col-md-4 col-lg-3">
          <div
            className="agregar-producto-card card h-100"
            onClick={onAgregarProducto}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <i className="bi bi-plus-lg fs-2"></i>
              <p className="mt-2 text-center">Agregar producto</p>
            </div>
          </div>
        </div>
      )}

      {productos.length === 0 ? (
        <div className="col-12 text-center py-5">
          <h5>No se encontraron productos</h5>
          <p>Intenta con otros filtros o términos de búsqueda</p>
        </div>
      ) : (
        productos.map((producto) => (
          <div key={producto.idProducto} className="col-12 col-md-4 col-lg-3">
            <CardProducto
              producto={producto}
              esAdmin={esAdmin}
              onUpdate={onUpdate}
              onEditarProducto={onEditarProducto}
            />
          </div>
        ))
      )}
    </div>
  );
}
