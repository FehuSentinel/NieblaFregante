import React, { useState, useContext } from 'react';
import './cardproducto.css';
import axios from 'axios';
import { CarritoProductosContext } from '../../../context/CarritoProductosContext';
import { AuthContext } from '../../../context/authcontext';

export default function TarjetaProducto({ producto, esAdmin, onEditarProducto, onUpdate }) {
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [cargandoStock, setCargandoStock] = useState(false);
  const { agregarProducto } = useContext(CarritoProductosContext);

  const alternarDetalle = () => setMostrarDetalle(!mostrarDetalle);
  const estaAgotado = !esAdmin && producto.stock <= 0;

  const manejarAgregarCarrito = () => {
    if (producto.stock > 0 || esAdmin) {
      agregarProducto(producto);
    }
  };

  const actualizarStockDesdeBackend = async (cantidad) => {
    try {
      const token = localStorage.getItem('token');
      setCargandoStock(true);
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/productos/${producto.idProducto}/stock`,
        { cantidad },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Actualizar el producto desde backend
      onUpdate?.(data);
    } catch (err) {
      console.error('Error al actualizar stock:', err);
      alert(err?.response?.data?.error || 'Error al actualizar stock');
    } finally {
      setCargandoStock(false);
    }
  };

  const manejarAumentarStock = () => actualizarStockDesdeBackend(1);
  const manejarReducirStock = () => {
    if (producto.stock > 0) {
      actualizarStockDesdeBackend(-1);
    }
  };

  const manejarEliminarProducto = async () => {
    const confirmar = confirm(`¿Estás seguro de que deseas eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`);
    if (!confirmar) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/productos/${producto.idProducto}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Producto eliminado correctamente.');
    } catch (err) {
      console.error('Error al eliminar producto:', err);
    }
  };

  return (
    <>
      <div className={`card tarjeta-prod ${estaAgotado ? 'agotado' : ''}`}>
        {estaAgotado && <div className="overlay-agotado">AGOTADO</div>}

        <img
          src={`${import.meta.env.VITE_MEDIA_URL}/uploads/images/${producto.imagenUrl}`}
          className="img-prod"
          alt={producto.nombre}
        />
        <div className="cuerpo-tarjeta">
          <h5 className="titulo-prod">{producto.nombre}</h5>
          <p className="ml-prod">{producto.ml}ml</p>
          <p>{producto.categoria?.nombre || 'Sin categoría'}</p>
          {producto.enPromocion ? (
            <>
              <span className="etiqueta-descuento">
                -{producto.porcentajeDescuento}% OFF
              </span>

              <p className="precio-original">${Number(producto.precio).toLocaleString('es-CL')}</p>
              <p className="precio-descuento">${Number(producto.precioConDescuento).toLocaleString('es-CL')}</p>
            </>
          ) : (
            <h6 className="precio-prod">${Number(producto.precio).toLocaleString('es-CL')}</h6>
          )}


          {esAdmin && (
            <p className={`stock-prod ${producto.stock <= 0 ? 'text-danger' : 'text-success'}`}>
              Stock: {producto.stock}
            </p>
          )}

          {!esAdmin ? (
            <div className="cont-botones">
              <button
                className={`btn ${estaAgotado ? 'btn-secondary' : 'btn-agregar'}`}
                onClick={manejarAgregarCarrito}
                disabled={estaAgotado}
              >
                {estaAgotado ? 'Agotado' : 'Agregar al carrito'}
              </button>
              <button className="btn btn-detalle" onClick={alternarDetalle}>
                Más detalles
              </button>
            </div>
          ) : (
            <div className="botones-admin">
              <button className="btn-admin" onClick={alternarDetalle}>🔍</button>
              <button className="btn-admin" onClick={manejarAumentarStock} disabled={cargandoStock}>➕</button>
              <button className="btn-admin" onClick={manejarReducirStock} disabled={cargandoStock || producto.stock <= 0}>➖</button>
              <button className="btn-admin" onClick={() => onEditarProducto(producto)}>✏️</button>
              <button className="btn-admin" onClick={manejarEliminarProducto}>🗑️</button>
            </div>
          )}
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
            <h3 className="titulo-modal">{producto.nombre}</h3>

            <div className="info-detalle">
              <p><strong>Marca:</strong> {producto.marca}</p>
              <p><strong>Mililitros:</strong> {producto.ml}ml</p>
              <p><strong>Categoría:</strong> {producto.categoria?.nombre || 'Sin categoría'}</p>
              <p><strong>Stock:</strong> {producto.stock}</p>
              {producto.enPromocion ? (
                <>
                  <span className="etiqueta-descuento">
                    -{producto.porcentajeDescuento}% OFF
                  </span>

                  <p className="precio-original">${Number(producto.precio).toLocaleString('es-CL')}</p>
                  <p className="precio-descuento">${Number(producto.precioConDescuento).toLocaleString('es-CL')}</p>
                </>
              ) : (
                <h4 className="precio-prod">${Number(producto.precio).toLocaleString('es-CL')}</h4>
              )}
            </div>

            {!esAdmin && (
              <button
                className={`btn ${estaAgotado ? 'btn-secondary' : 'btn-agregar-modal'}`}
                onClick={manejarAgregarCarrito}
                disabled={estaAgotado}
              >
                {estaAgotado ? 'Agotado' : 'Agregar al carrito'}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
