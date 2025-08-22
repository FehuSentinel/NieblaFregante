// src/components/Home/PanelPromos.jsx
import React from 'react';
import './PanelPromos.css'

export default function PanelPromos({ onEditar }) {
    return (
        <section className="home-section">
            <div className='fondopanel'>
                <div className="container mt-2">
                    <h2 className="section-title">🎛 Panel de Promociones</h2>
                    <button className="btn btn-primary" onClick={onEditar}>
                        ✏️ Editar Banners
                    </button>
                </div>
            </div>
        </section>
    );
}
