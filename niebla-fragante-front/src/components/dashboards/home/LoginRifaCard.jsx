import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginRifaCard.css';

export default function LoginRifaCard() {
    const navigate = useNavigate();

    return (
        <div className='fondorifalogin'>

            <div className="login-rifa-card">
                <h2 className="login-titulo">Participa en nuestras rifas exclusivas</h2>
                <p className="login-texto">
                    Regístrate y no te pierdas la oportunidad de ganar perfumes únicos cada semana.
                </p>
                <button className="btn-agregar-desc" onClick={() => navigate('/login')}>
                    Iniciar sesión
                </button>
            </div>
        </div>

    );
}
