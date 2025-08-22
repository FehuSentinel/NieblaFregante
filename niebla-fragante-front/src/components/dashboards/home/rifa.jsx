import React, { useState, useContext } from 'react';
import CalendarioRifa from './calendariorifa';
import CardProductoRifa from './cardproductorifa';
import CarritoFlotanteRifa from '../carrito/carritorifa';
import { AuthContext } from '../../../context/authcontext';
import './rifa.css';

export default function Rifa({ rifa, producto }) {
  const [mostrarProductoFlotante, setMostrarProductoFlotante] = useState(false);
  const [mostrarCarritoFlotante, setMostrarCarritoFlotante] = useState(false);
  const { usuario } = useContext(AuthContext);

  return (
    <div className="fondo position-relative">
     <h3 className="titulo-seccion">
  <span className="fuego">🔥</span> RIFA <span className="fuego">🔥</span>
</h3>

      <div className="container my-4">
        <div className="row">
          {/* 🟩 Calendario siempre visible */}
          <div className="col-md-7  columnaizquierda">
            <CalendarioRifa rifa={rifa} />
          </div>

          {/* 🟦 Producto y Carrito visibles solo en escritorio */}
          <div className="col-md-5 columnaderecha d-none d-md-flex flex-column align-items-center gap-4">
            <CardProductoRifa producto={producto} />
            <CarritoFlotanteRifa />
          </div>


                    {/* 📱 Botón móvil para carrito */}
          <div className="col-12 d-md-none mt-3 text-center">
            <button
              className="btn-agregar-desc"
              onClick={() => setMostrarCarritoFlotante(true)}
            >
              CARRITO
            </button>
                        <button
              className="btn-agregar-desc"
              onClick={() => setMostrarProductoFlotante(true)}
            >
              Ver producto sorteado
            </button>
          </div>

          {/* 📱 Botón móvil para producto */}
          <div className="col-12 d-md-none mt-3 text-center">

          </div>


        </div>
      </div>

      
      {/* 📱 Panel carrito */}

      {mostrarCarritoFlotante && (
        <div className="slide-panel">
          <button className="cerrar-panel" onClick={() => setMostrarCarritoFlotante(false)}>✖</button>
          <CarritoFlotanteRifa modoPanel={true} />
        </div>
      )}

      {/* 📱 Panel producto */}
      {mostrarProductoFlotante && (
        <div className="slide-panel">
          <button className="cerrar-panel" onClick={() => setMostrarProductoFlotante(false)}>✖</button>
          <CardProductoRifa producto={producto} />
        </div>
      )}


    </div>
  );
}
