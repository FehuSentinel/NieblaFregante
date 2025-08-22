import React, { useEffect, useState, useContext } from 'react';
import Bienvenida from './Bienvenida';
import Rifa from './rifa';
import SinRifa from './SinRifa';
import HighlightRifa from './HighlightRifa';
import axios from 'axios';
import { AuthContext } from '../../../context/authcontext';
import CargandoPerfume from '../loader/CargandoPerfume';
import CarruselPromos from './CarruselPromos';
import ScrollDescuentos from './ScrollDescuentos';
import SeccionRifa from './SeccionRifa';
import PanelPromos from './PanelPromos';
import ModalEditarPromos from './ModalEditarPromos';

import './home.css';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  const [rifaActiva, setRifaActiva] = useState(null);
  const [productoSorteado, setProductoSorteado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [ganador, setGanador] = useState(null);
  const [numerosVendidos, setNumerosVendidos] = useState([]);
  const [mostrarAnimacion, setMostrarAnimacion] = useState(false);
  const [mostrarModalPromos, setMostrarModalPromos] = useState(false);

  const esAdmin =
    usuario?.tipo?.toLowerCase() ===
    import.meta.env.VITE_TIPO_PERMITIDO_B?.toLowerCase();

  useEffect(() => {
    const obtenerRifa = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/rifas/activa`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (data && data.rifa) {
          setRifaActiva(data.rifa);
          setProductoSorteado(data.producto);
        }
      } catch (error) {
        console.error('No hay rifa activa:', error);
      } finally {
        setCargando(false);
      }
    };

    obtenerRifa();
  }, []);

  const lanzarSorteo = async () => {
    if (!rifaActiva) return;

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/rifas/${rifaActiva.id}`);
      setGanador(res.data.ganador);
      setNumerosVendidos(res.data.numerosVendidos);
      setMostrarAnimacion(true);
    } catch (err) {
      console.error('Error al lanzar sorteo', err);
    }
  };

  return (
    <div>
      {/* Sección 1: Bienvenida */}
      <section className="home-section">
        <Bienvenida />
      </section>

      {/* Panel Admin de Promos */}
      {esAdmin && (
        <PanelPromos onEditar={() => setMostrarModalPromos(true)} />
      )}

      {/* Carrusel Promociones */}
      <section className="home-section">
        <CarruselPromos />
      </section>

      {/* Modal Promociones */}
      {mostrarModalPromos && (
        <ModalEditarPromos onClose={() => setMostrarModalPromos(false)} />
      )}

      {/* Carrusel Descuentos */}
      <section>
        <ScrollDescuentos />
      </section>

      {/* Sección Rifa */}
      <SeccionRifa
        usuario={usuario}
        esAdmin={esAdmin}
        cargando={cargando}
        rifaActiva={rifaActiva}
        productoSorteado={productoSorteado}
        mostrarAnimacion={mostrarAnimacion}
        ganador={ganador}
        numerosVendidos={numerosVendidos}
        onLanzar={lanzarSorteo}
      />
    </div>
  );
}
