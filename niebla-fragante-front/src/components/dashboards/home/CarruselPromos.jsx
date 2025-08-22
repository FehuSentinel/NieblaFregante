import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CarruselPromos.css';

export default function CarruselPromos() {
  const [imagenes, setImagenes] = useState([]);

  // 🔁 Cargar imágenes
  useEffect(() => {
    const fetchImagenes = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/promos`);
        setImagenes(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error al cargar imágenes promocionales', err);
      }
    };

    fetchImagenes();
  }, []);

  // 🔄 Activar autoplay si hay 2 o más imágenes
  useEffect(() => {
    if (imagenes.length >= 2) {
      const el = document.getElementById('carouselPromos');
      if (el && window.bootstrap) {
        const carousel = new window.bootstrap.Carousel(el, {
          interval: 5000,
          ride: 'carousel',
          pause: false,
          wrap: true
        });
        carousel.cycle();
      }
    }
  }, [imagenes]);

  const scrollToNextSection = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <section className="promos-section mt-2">


      <div id="carouselPromos" className="carousel slide">
        <div className="carousel-inner">
          {imagenes.map((img, index) => (
            <div
              key={img.nombre}
              className={`carousel-item ${index === 0 ? 'active' : ''}`}
            >
              <img
                src={`${import.meta.env.VITE_MEDIA_URL}/uploads/promociones/${img.nombre}`}
                className="d-block w-100 carousel-image"
                alt="Banner promocional"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselPromos"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" />
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselPromos"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" />
        </button>
      </div>


    </section>
  );
}
