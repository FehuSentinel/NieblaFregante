import React, { useContext } from 'react';
import './cardproductodescuento.css';
import { CarritoProductosContext } from '../../../context/CarritoProductosContext';

export default function CardProductoDescuento({ producto }) {
  const { agregarProducto } = useContext(CarritoProductosContext);
  const estaAgotado = producto.stock <= 0;

  const manejarAgregarCarrito = () => {
    if (producto.stock > 0) {
      agregarProducto(producto);
    }
  };

  return (
    <div className={`card tarjeta-descuento ${estaAgotado ? 'agotado' : ''}`}>
      {producto.enPromocion && producto.porcentajeDescuento && (
        <span className="etiqueta-descuento-desc">
          -{producto.porcentajeDescuento}% OFF
        </span>
      )}

      {estaAgotado && <div className="overlay-agotado-desc">AGOTADO</div>}

      <img
        src={`${import.meta.env.VITE_MEDIA_URL}/uploads/images/${producto.imagenUrl}`}
        className="img-descuento"
        alt={producto.nombre}
      />

      <div className="cuerpo-descuento">
        <h5 className="titulo-descuento">{producto.nombre}</h5>
        <p className="ml-descuento">{producto.ml}ml</p>
        <p>{producto.categoria?.nombre || 'Sin categoría'}</p>

        {producto.enPromocion ? (
          <>
            <p className="precio-original-desc">${Number(producto.precio).toLocaleString('es-CL')}</p>
            <p className="precio-descuento-desc">${Number(producto.precioConDescuento).toLocaleString('es-CL')}</p>
          </>
        ) : (
          <h6 className="precio-desc">${Number(producto.precio).toLocaleString('es-CL')}</h6>
        )}

        <div className="cont-botones-desc">
          <button
            className={`btn ${estaAgotado ? 'btn-secondary' : 'btn-agregar-desc'}`}
            onClick={manejarAgregarCarrito}
            disabled={estaAgotado}
          >
            {estaAgotado ? 'Agotado' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  );
}