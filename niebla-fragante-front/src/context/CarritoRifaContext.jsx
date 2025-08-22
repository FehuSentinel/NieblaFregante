import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from './authcontext';
import axios from 'axios';

export const CarritoRifaContext = createContext();

export const CarritoRifaProvider = ({ children }) => {
  const [rifas, setRifas] = useState([]);
  const [numerosSeleccionados, setNumerosSeleccionados] = useState([]);
  const [totalRifas, setTotalRifas] = useState(0);
  const [fechaReservaInicial, setFechaReservaInicial] = useState(null);

  const { usuario } = useContext(AuthContext);
  const yaCargado = useRef(false);

  // Calcular total
  useEffect(() => {
    setTotalRifas(numerosSeleccionados.length);
  }, [numerosSeleccionados]);

  // Cargar desde backend
  useEffect(() => {
    if (!usuario || yaCargado.current) return;
    yaCargado.current = true;

    const cargarCarrito = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/carrito-rifa`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const lista = data.numeros || [];

        setNumerosSeleccionados(
          lista.map((n) => ({
            numero: n.numero,
            rifaId: n.id_rifa,
            idNumero: n.idNumero,
            fechaReserva: n.fechaReserva ? new Date(n.fechaReserva) : null
          }))
        );

        const agrupadas = {};
        lista.forEach(n => {
          if (!agrupadas[n.id_rifa]) agrupadas[n.id_rifa] = [];
          agrupadas[n.id_rifa].push(n.numero);
        });

        const rifasCargadas = Object.entries(agrupadas).map(([id, numeros]) => ({
          id: parseInt(id),
          numeros
        }));

        setRifas(rifasCargadas);

        const fechas = lista.map(n => new Date(n.fechaReserva)).filter(Boolean);
        if (fechas.length > 0) {
          const primeraFecha = new Date(Math.min(...fechas.map(f => f.getTime())));
          setFechaReservaInicial(primeraFecha);
        }
      } catch (err) {
        console.error('❌ Error al cargar carrito de rifas:', err);
      }
    };

    cargarCarrito();
  }, [usuario]);

  // Agregar número
  const agregarNumeroRifa = async (numero, rifaId, idNumero) => {
    const yaExiste = numerosSeleccionados.some(n => n.numero === numero && n.rifaId === rifaId);
    if (yaExiste) return;

    const nuevaReserva = new Date();

    setNumerosSeleccionados(prev => {
      const nuevos = [...prev, { numero, rifaId, idNumero, fechaReserva: nuevaReserva }];
      const fechas = nuevos.map(n => n.fechaReserva).filter(Boolean);
      if (fechas.length > 0) {
        const primera = new Date(Math.min(...fechas.map(f => f.getTime())));
        setFechaReservaInicial(primera);
      }
      return nuevos;
    });

    setRifas(prev => {
      const existe = prev.find(r => r.id === rifaId);
      if (existe) {
        return prev.map(r =>
          r.id === rifaId
            ? { ...r, numeros: [...r.numeros, numero] }
            : r
        );
      }
      return [...prev, { id: rifaId, numeros: [numero] }];
    });

    if (usuario?.id && idNumero) {


      try {
        const token = localStorage.getItem('token');
        await axios.post(
          `${import.meta.env.VITE_API_URL}/carrito-rifa/agregar`,
          { numerosSeleccionados: [idNumero] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error('❌ Error al agregar número al backend:', err);
      }
    }
  };

  // Eliminar número
  const eliminarNumeroRifa = async (numero, rifaId) => {
    const seleccionado = numerosSeleccionados.find(n => n.numero === numero && n.rifaId === rifaId);
    const idNumero = seleccionado?.idNumero;

    const nuevaLista = numerosSeleccionados.filter(n => !(n.numero === numero && n.rifaId === rifaId));
    setNumerosSeleccionados(nuevaLista);

    const fechas = nuevaLista.map(n => n.fechaReserva).filter(Boolean);
    setFechaReservaInicial(fechas.length > 0 ? new Date(Math.min(...fechas.map(f => f.getTime()))) : null);

    setRifas(prev =>
      prev.map(r =>
        r.id === rifaId
          ? { ...r, numeros: r.numeros.filter(n => n !== numero) }
          : r
      ).filter(r => r.numeros.length > 0)
    );

    if (usuario?.id && idNumero) {

      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/carrito-rifa/${idNumero}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error('❌ Error al eliminar número del backend:', err);
      }
    }
  };

  const limpiarCarritoRifas = () => {
    setRifas([]);
    setNumerosSeleccionados([]);
    setTotalRifas(0);
    setFechaReservaInicial(null);
  };

  return (
    <CarritoRifaContext.Provider
      value={{
        rifas,
        numerosSeleccionados,
        totalRifas,
        fechaReservaInicial,
        agregarNumeroRifa,
        eliminarNumeroRifa,
        limpiarCarritoRifas
      }}
    >
      {children}
    </CarritoRifaContext.Provider>
  );
};

export const useCarritoRifa = () => useContext(CarritoRifaContext);
