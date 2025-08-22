import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from './authcontext';
import axios from 'axios';

export const CarritoProductosContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const { usuario } = useContext(AuthContext);
  const yaCargado = useRef(false);

  // 🔁 Cargar carrito desde backend o localStorage
  useEffect(() => {
    if (usuario === undefined || yaCargado.current) return;

    const cargarCarrito = async () => {
      yaCargado.current = true;


      if (usuario?.id_usuario) {
        try {
          const token = localStorage.getItem('token');
          const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/carrito/${usuario.id_usuario}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const detalles = data.detalles?.map((d) => ({
            ...d.producto,
            cantidad: d.cantidad,
            precio: parseFloat(d.precioUnitario)
          })) || [];

          setCarrito(detalles);
        } catch (error) {
          console.error('❌ Error al cargar carrito del usuario:', error);
        }
      } else {
        const guardado = localStorage.getItem('carrito');
        if (guardado) {
          const carritoLocal = JSON.parse(guardado);
          setCarrito(carritoLocal);
        }
      }
    };

    cargarCarrito();
  }, [usuario]);

  // 💾 Guardar localmente si es invitado
  useEffect(() => {
    if (!usuario?.id_usuario) {
      localStorage.setItem('carrito', JSON.stringify(carrito));
    }
  }, [carrito, usuario]);

  // ✅ Agregar producto
  const agregarProducto = async (producto) => {
    const precioUnitario = producto.enPromocion && producto.precioConDescuento
      ? parseFloat(producto.precioConDescuento)
      : parseFloat(producto.precio);

    setCarrito((prev) => {
      const existente = prev.find(p => p.idProducto === producto.idProducto);
      if (existente && existente.cantidad >= producto.stock) return prev;

      return existente
        ? prev.map(p =>
            p.idProducto === producto.idProducto
              ? { ...p, cantidad: p.cantidad + 1 }
              : p
          )
        : [...prev, { ...producto, cantidad: 1, precio: precioUnitario }];
    });

    if (usuario?.id_usuario) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(
          `${import.meta.env.VITE_API_URL}/carrito/agregar`,
          {
            id_usuario: usuario.id_usuario,
            id_producto: producto.idProducto,
            cantidad: 1
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } catch (err) {
        console.error('❌ Error al agregar producto al carrito:', err);
      }
    }
  };

  // 🗑️ Quitar producto
  const quitarProducto = async (idProducto) => {
    setCarrito(prev => prev.filter(p => p.idProducto !== idProducto));

    if (usuario?.id_usuario) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_API_URL}/carrito/eliminar`, {
          data: {
            id_usuario: usuario.id_usuario,
            id_producto: idProducto
          },
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error('❌ Error al eliminar producto del carrito:', err);
      }
    }
  };

  // 🧹 Vaciar carrito completo
  const vaciarCarrito = async () => {
    setCarrito([]);
    if (usuario?.id_usuario) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/carrito/vaciar/${usuario.id_usuario}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } catch (err) {
        console.error('❌ Error al vaciar carrito:', err);
      }
    }
  };

  // 🔄 Cambiar cantidad
  const actualizarCantidad = async (idProducto, cantidad) => {
    if (cantidad <= 0) return quitarProducto(idProducto);

    setCarrito(prev =>
      prev.map(p =>
        p.idProducto === idProducto ? { ...p, cantidad } : p
      )
    );

    if (usuario?.id_usuario) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(
          `${import.meta.env.VITE_API_URL}/carrito/actualizar-cantidad`,
          {
            id_usuario: usuario.id_usuario,
            id_producto: idProducto,
            cantidad
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } catch (err) {
        console.error('❌ Error al actualizar cantidad del producto:', err);
      }
    }
  };

  return (
    <CarritoProductosContext.Provider
      value={{
        carrito,
        agregarProducto,
        quitarProducto,
        vaciarCarrito,
        actualizarCantidad
      }}
    >
      {children}
    </CarritoProductosContext.Provider>
  );
}
