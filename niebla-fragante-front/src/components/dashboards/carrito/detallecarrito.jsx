import React, { useState, useContext } from 'react';
import { CarritoProductosContext } from '../../../context/CarritoProductosContext';
import ScrollCards from './scrollcards';
import FormularioEnvio from './formularioenvio';
import './carrito.css';
import './detallecarrito.css';

export default function DetalleCarrito() {
  const { carrito } = useContext(CarritoProductosContext);

  // ✅ Calcular total con precio con descuento si aplica
  const total = carrito.reduce((acc, p) => {
    const precioUnitario = p.enPromocion && p.precioConDescuento
      ? Number(p.precioConDescuento)
      : Number(p.precio);
    return acc + precioUnitario * p.cantidad;
  }, 0);

  const [metodoEntrega, setMetodoEntrega] = useState(null);
  const [mostrarFormularioEnvio, setMostrarFormularioEnvio] = useState(false);
  const [direccionDespacho, setDireccionDespacho] = useState(null);

  const manejarRetiro = () => {
    setMetodoEntrega('retiro');
    setMostrarFormularioEnvio(false);
    setDireccionDespacho(null);
  };

  const manejarDespacho = () => {
    setMetodoEntrega('despacho');
    setMostrarFormularioEnvio(true);
  };

  const iniciarPago = async () => {
    try {
      const ordenCompra = `orden-${Date.now()}`;
      const id_usuario = localStorage.getItem('id_usuario');

      const res = await fetch(`${import.meta.env.VITE_API_URL}/pago/crear-transaccion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monto: total,
          ordenCompra,
          id_usuario
        })
      });

      const data = await res.json();

      if (data.token && data.url) {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        localStorage.setItem('metodoEntrega', metodoEntrega);
        localStorage.setItem('direccion', JSON.stringify(direccionDespacho));
        localStorage.setItem('id_usuario', id_usuario);
        window.location.href = `${data.url}?token_ws=${data.token}`;
      } else {
        alert('No se pudo iniciar la transacción');
      }
    } catch (error) {
      console.error('❌ Error al iniciar pago:', error);
      alert('Error al procesar el pago');
    }
  };

  return (
    <div className="detalle-carrito-grid container my-4">
      <div className="columna-izquierda">
        <h2 className="mb-3">Productos seleccionados</h2>
        <ScrollCards productos={carrito} />

        {metodoEntrega === 'retiro' && (
          <p className="info-retiro mt-4">
            📍 <strong>Dirección de retiro:</strong><br />
            <span>Santa Isabel 431, Santiago Centro, Depto 509</span><br />
            <span>Nosotros bajamos a entregar el producto</span>
          </p>
        )}

        {metodoEntrega === 'despacho' && (
          <div className="info-retiro mt-4">
            {direccionDespacho ? (
              <>
                🏠 <strong>Dirección de envío:</strong><br />
                <span>
                  {direccionDespacho.calle} {direccionDespacho.numero}
                  {direccionDespacho.depto ? `, Depto ${direccionDespacho.depto}` : ''},<br />
                  {direccionDespacho.comuna}, {direccionDespacho.ciudad}
                </span><br />
                {direccionDespacho.comentario && (
                  <em>📝 {direccionDespacho.comentario}</em>
                )}
              </>
            ) : (
              <p>🏠 Dirección de envío: <em>(Se ingresará en el formulario)</em></p>
            )}
          </div>
        )}
      </div>

      <div className="columna-derecha">
        <h4>Resumen del Pedido</h4>
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

        <h5 className="total-final mt-3">
          Total a pagar: ${total.toLocaleString('es-CL')}
        </h5>

        <div className="entrega-opciones mt-4" style={{ display: 'flex', gap: '1rem' }}>
          <button
            className={`pagar ${metodoEntrega === 'retiro' ? 'activo' : ''}`}
            onClick={manejarRetiro}
          >
            Retiro en tienda
          </button>
          <button
            className={`pagar ${metodoEntrega === 'despacho' ? 'activo' : ''}`}
            onClick={manejarDespacho}
          >
            Despacho
          </button>
        </div>

        {metodoEntrega === 'retiro' && (
          <button className="pagar mt-3" onClick={iniciarPago}>Confirmar y Pagar</button>
        )}

        {metodoEntrega === 'despacho' && direccionDespacho && (
          <button className="pagar mt-3" onClick={iniciarPago}>Confirmar y Pagar</button>
        )}
      </div>

      <FormularioEnvio
        visible={mostrarFormularioEnvio}
        onClose={() => setMostrarFormularioEnvio(false)}
        onDireccionIngresada={setDireccionDespacho}
      />
    </div>
  );
}
