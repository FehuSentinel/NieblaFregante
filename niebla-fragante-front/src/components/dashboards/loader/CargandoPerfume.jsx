import React, { useEffect, useState } from 'react';
import './cargandoPerfume.css';

export default function CargandoPerfume({ visible = true }) {
  const [progreso, setProgreso] = useState(0);
  const [spraying, setSpraying] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgreso(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    const sprayInterval = setInterval(() => {
      setSpraying(true);
      setTimeout(() => setSpraying(false), 800);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearInterval(sprayInterval);
    };
  }, []);

  return (
    <div className={`cargando-overlay ${visible ? 'mostrar' : 'ocultar'}`}>
      <div className="perfume-container">
        <div className="perfume-perfil">
          <div className="frasco">
            <div className="frasco-parte frasco-cuello"></div>
            <div className="frasco-parte frasco-cuerpo">
              <div className="liquido" style={{ height: `${20 + (progreso * 0.6)}%` }}>
                <div className="burbujas">
                  {Array(8).fill().map((_, i) => (
                    <div key={i} className={`burbuja b${i}`}></div>
                  ))}
                </div>
              </div>
              <div className="reflejo"></div>
            </div>
            <div className="frasco-parte frasco-base"></div>
          </div>

          <div className="atomizador">
            <div className={`atomizador-boton ${spraying ? 'presionado' : ''}`}></div>
            <div className="atomizador-conector"></div>
            <div className="atomizador-tubo"></div>
            <div className="atomizador-boquilla"></div>
          </div>

          <div className={`spray-container ${spraying ? 'activo' : ''}`}>
            <div className="spray-niebla"></div>
            {Array(15).fill().map((_, i) => (
              <div key={i} className={`spray-gota spray-gota-${i}`}></div>
            ))}
          </div>
        </div>
      </div>

      <div className="cargando-info">
        <h3 className="texto-cargando">
          Cargando esencia
          <span className="dots">
            <span className="dot dot1">.</span>
            <span className="dot dot2">.</span>
            <span className="dot dot3">.</span>
          </span>
        </h3>
        <div className="barra-carga">
          <div className="barra-progreso" style={{ width: `${progreso}%` }}></div>
        </div>
        <div className="porcentaje">{progreso}%</div>
      </div>
    </div>
  );
}
