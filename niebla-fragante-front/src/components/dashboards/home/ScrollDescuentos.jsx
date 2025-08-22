import React, { useEffect, useState } from 'react';
import './scrollDescuentos.css';
import API from '../../../api';
import CardProductoDescuento from './CardProductoDescuento';

export default function ScrollDescuentos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const obtenerProductosConDescuento = async () => {
      try {
        const { data } = await API.get('/productos');
        const productosConDescuento = data.filter(p => p.enPromocion);
        setProductos(productosConDescuento);
      } catch (error) {
        console.error('Error al cargar productos con descuento:', error);
      }
    };
    obtenerProductosConDescuento();
  }, []);

  return (
    <div className="scroll-descuentos-wrapper">
     <h3 className="titulo-seccion">
   Descuentos 
</h3>
      <div className="scroll-descuentos">
        {productos.map(p => (
          <CardProductoDescuento key={p.idProducto} producto={p} esAdmin={false} />
        ))}
      </div>
    </div>
  );
}
