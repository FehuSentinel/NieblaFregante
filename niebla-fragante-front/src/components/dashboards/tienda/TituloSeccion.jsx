import React from 'react';
import './TituloSeccion.css';

export default function TituloSeccion({ texto, children }) {
  return (
    <div className="titulo-seccion-container position-relative">
     <h1 className="titulo-seccion text-center d-none d-md-block">{texto}</h1>
      {children && <div className="titulo-extra">{children}</div>}
    </div>
  );
}
