import React, { useState, useContext } from 'react';
import './cardcarrito.css';
import { CarritoProductosContext } from '../../../context/CarritoProductosContext';
import '../tienda/cardproducto.css';

export default function CardCarrito({ producto }) {
    const [mostrarDetalle, setMostrarDetalle] = useState(false);
    const { actualizarCantidad, quitarProducto } = useContext(CarritoProductosContext);

    const alternarDetalle = () => setMostrarDetalle(!mostrarDetalle);
    const estaAgotado = producto.stock <= 0;
    const cantidad = producto.cantidad;

    const aumentar = () => {
        if (cantidad < producto.stock) {
            actualizarCantidad(producto.idProducto, cantidad + 1);
        }
    };

    const disminuir = () => {
        if (cantidad > 1) {
            actualizarCantidad(producto.idProducto, cantidad - 1);
        } else {
            quitarProducto(producto.idProducto);
        }
    };

    const precioUnitario = producto.enPromocion && producto.precioConDescuento
        ? Number(producto.precioConDescuento)
        : Number(producto.precio);

    return (
        <>
            <div className="card card-carrito">
                <img
                    src={`${import.meta.env.VITE_MEDIA_URL}/uploads/images/${producto.imagenUrl}`}
                    className="img-card-carrito"
                    alt={producto.nombre}
                />
                <div className="info-card-carrito">
                    <h6>{producto.nombre}</h6>

                    {producto.enPromocion && producto.precioConDescuento ? (
                      <>
                        <p className="precio-original">${Number(producto.precio).toLocaleString('es-CL')} c/u</p>
                        <p className="precio-descuento">${precioUnitario.toLocaleString('es-CL')} c/u</p>
                      </>
                    ) : (
                      <p className="precio-unitario">
                        ${precioUnitario.toLocaleString('es-CL')} c/u
                      </p>
                    )}

                    {producto.stock <= cantidad ? (
                        <p className="stock-limite">Stock máximo: {producto.stock}</p>
                    ) : (
                        <p className="stock-actual">Cantidad: {cantidad}</p>
                    )}
                    <div className="botones-card">
                        <button onClick={disminuir}>➖</button>
                        <button onClick={aumentar}>➕</button>
                        <button onClick={() => quitarProducto(producto.idProducto)}>🗑️</button>
                    </div>
                </div>
            </div>

            {mostrarDetalle && (
                <div className="modal-detalle" onClick={alternarDetalle}>
                    <div className="contenido-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="btn-cerrar" onClick={alternarDetalle}>✖</button>
                        <img
                            src={`${import.meta.env.VITE_MEDIA_URL}/uploads/images/${producto.imagenUrl}`}
                            className="img-modal"
                            alt={producto.nombre}
                        />
                        <h5>{producto.nombre}</h5>
                        <p>{producto.descripcion}</p>
                        <div className="info-detalle">
                            <p><strong>Marca:</strong> {producto.marca}</p>
                            <p><strong>Mililitros:</strong> {producto.ml}ml</p>
                            <p><strong>Stock:</strong> {producto.stock}</p>
                            <p><strong>Precio:</strong> ${Number(producto.precio).toLocaleString('es-CL')}</p>
                            <p><strong>Categoría:</strong> {producto.categoria?.nombre || 'Sin categoría'}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
