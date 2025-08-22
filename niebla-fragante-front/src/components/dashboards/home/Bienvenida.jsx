import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './bienvenida.css';

// Imágenes desde carpeta public/assets
const carouselImages = [
  '/assets/img1.jpeg',

];

export default function Bienvenida() {
  const navigate = useNavigate();

  useEffect(() => {
    const el = document.getElementById('carouselBienvenida');
    if (el && window.bootstrap) {
      const carousel = new window.bootstrap.Carousel(el, {
        interval: 3000,
        ride: 'carousel',
        pause: false,
        wrap: true
      });

      carousel.cycle();
    }
  }, []);

  const irATienda = () => {
    navigate('/tienda');
  };

  return (
    <section className="bienvenida-section" style={{ borderRadius: '25px' }}>
      {/* Carrusel Bootstrap */}
      <div id="carouselBienvenida" className="carousel slide">
        <div className="carousel-inner">
          {carouselImages.map((img, index) => (
            <div
              key={`carousel-item-${index}`}
              className={`carousel-item ${index === 0 ? 'active' : ''}`}
            >
              <img
                src={img}
                className="d-block w-100 carousel-image"
                alt={`Imagen de bienvenida ${index + 1}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Overlay de texto */}
      <div className="welcome-overlay">
        <h1 className='welcome-title'>Niebla Fragante</h1>
        <p className="welcome-subtitle">
         Fragancias que despiertan sensaciones y destinos.
        </p>
      </div>

      {/* Botón de flecha */}
      <button className="scroll-down-button" onClick={irATienda}>
        <span className="scroll-icon">↓</span>
        <span className="scroll-label">Tienda</span>
      </button>
    </section>
  );
}
