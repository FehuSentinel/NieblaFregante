// src/components/Home/SeccionRifa.jsx
import React from 'react';
import Rifa from './rifa';
import SinRifa from './SinRifa';
import HighlightRifa from './HighlightRifa';
import PanelRifa from './PanelRifa';
import CargandoPerfume from '../loader/CargandoPerfume';
import { useNavigate } from 'react-router-dom';
import './SeccionRifa.css';
import LoginRifaCard from './LoginRifaCard';

export default function SeccionRifa({
  usuario,
  esAdmin,
  cargando,
  rifaActiva,
  productoSorteado,
  mostrarAnimacion,
  ganador,
  numerosVendidos,
  onLanzar
}) {
  const navigate = useNavigate();

  return (
    <section className="home-section dark">
      {/* Botones de admin */}
      {esAdmin && <PanelRifa onLanzar={onLanzar} />}

      {/* Contenido principal de la rifa */}
      {cargando ? (
        <CargandoPerfume />
      ) : !usuario ? (
        <LoginRifaCard />
      ) : mostrarAnimacion ? (
        <HighlightRifa
          totalNumeros={rifaActiva.totalNumeros}
          numerosVendidos={numerosVendidos}
          ganador={ganador}
        />
      ) : rifaActiva ? (
        <Rifa rifa={rifaActiva} producto={productoSorteado} />
      ) : (
        <SinRifa />
      )}
    </section>
  );
}
