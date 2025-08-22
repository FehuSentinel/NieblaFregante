import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarritoProductosContext } from '../../../context/CarritoProductosContext';
import ScrollCards from './scrollcards';
import './carrito.css';
import '../tienda/cardproducto.css';

export default function Carrito({ mostrar, onClose }) {
  const { carrito } = useContext(CarritoProductosContext);
  const navigate = useNavigate();

  // ✅ Calcular total considerando descuento
  const total = carrito.reduce((acc, p) => {
    const precioUnitario = p.enPromocion && p.precioConDescuento
      ? Number(p.precioConDescuento)
      : Number(p.precio);
    return acc + precioUnitario * p.cantidad;
  }, 0);

  if (!mostrar) return null;

  const handleClickFondo = (e) => {
    if (e.target.classList.contains('fondo-carrito')) {
      onClose();
    }
  };

  const irADetalleCarrito = () => {
    onClose();
    setTimeout(() => {
      navigate('/detallecarrito');
    }, 300);
  };

  return (
    <div className="fondo-carrito" onClick={handleClickFondo}>
      <div className="panel-carrito">
        <button className="cerrar-carrito" onClick={onClose}>✕</button>

        <h2 className="mb-3">Tu Carrito</h2>

        {carrito.length === 0 ? (
          <p>Tu carrito está vacío</p>
        ) : (
          <>
            <ScrollCards productos={carrito} />

            <div className="detalle-carrito-resumen">
              <h4>Detalle:</h4>
              <ul className="lista-detalle">
                {carrito.map((p) => {
                  const precioUnitario = p.enPromocion && p.precioConDescuento
                    ? Number(p.precioConDescuento)
                    : Number(p.precio);
                  return (
                    <li key={p.idProducto}>
                      {p.nombre} (x{p.cantidad}) — ${(precioUnitario * p.cantidad).toLocaleString('es-CL')}
                    </li>
                  );
                })}
              </ul>

              <h5 className="total-final">
                Total a pagar: ${total.toLocaleString('es-CL')}
              </h5>

              <div className="acciones-carrito">
                <button className="pagar" onClick={irADetalleCarrito}>
                  Proceder al Pago
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
