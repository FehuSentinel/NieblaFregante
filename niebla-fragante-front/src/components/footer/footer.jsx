import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-contenido container d-flex flex-column flex-md-row justify-content-between align-items-center py-3">
        <div className="footer-info text-center text-md-start mb-3 mb-md-0">
          <p className="mb-1">&copy; {new Date().getFullYear()} Niebla Fragante</p>
          <a href="/terminos" className="footer-link">Términos legales</a>
        </div>

        <div className="footer-redes d-flex justify-content-center gap-3">
          <a href="https://www.instagram.com/nieblafragante/" target="_blank" rel="noopener noreferrer" className="social-link">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="https://www.facebook.com/nieblafragante/" target="_blank" rel="noopener noreferrer" className="social-link">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="https://www.tiktok.com/@nieblafragante" target="_blank" rel="noopener noreferrer" className="social-link">
            <i className="bi bi-tiktok"></i>
          </a>
          <a href="https://wa.me/+56979850943" target="_blank" rel="noopener noreferrer" className="social-link">
            <i className="bi bi-whatsapp"></i>
          </a>
          <a href="mailto:contacto@nieblafragante.cl" className="social-link">
            <i className="bi bi-envelope-fill"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
