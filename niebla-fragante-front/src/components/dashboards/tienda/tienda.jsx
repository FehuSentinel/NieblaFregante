import React, { useEffect, useState, useContext } from 'react';
import Filtros from './filtroproductos';
import Searchbar from './searchbar';
import FormularioProducto from './formproducto';
import GridProductos from './GridProductos';
import TituloSeccion from './TituloSeccion';
import './tienda.css';
import axios from 'axios';
import { AuthContext } from '../../../context/authcontext';
import CargandoPerfume from '../loader/CargandoPerfume';

export default function Tienda() {
  const { usuario } = useContext(AuthContext);
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtros, setFiltros] = useState({
    categorias: [],
    marca: '',
    ml: [],
    precio: [0, 100000],
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [cargando, setCargando] = useState(true);

  const tipoPermitidoB = import.meta.env.VITE_TIPO_PERMITIDO_B || 'admin';
  const esTipoB = usuario?.tipo?.toLowerCase() === tipoPermitidoB.toLowerCase();
  const esTipoA = usuario?.tipo?.toLowerCase() === (import.meta.env.VITE_TIPO_PERMITIDO_A || 'user').toLowerCase();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/productos`);
        if (Array.isArray(data)) {
          setProductos(data);
        }
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };

    fetchProductos();
  }, []);

  useEffect(() => {
    if (productos.length > 0) {
      const resultadoFiltrado = filtrarProductos(productos);
      setProductosFiltrados(resultadoFiltrado);
    }
  }, [productos, busqueda, filtros, esTipoA]);

  const filtrarProductos = (productosAFiltrar) => {
    const texto = busqueda.toLowerCase();

    return productosAFiltrar.filter((prod) => {
      if (esTipoA && prod.stock <= 0) return false;

      const coincideBusqueda =
        prod.nombre.toLowerCase().includes(texto) ||
        prod.marca.toLowerCase().includes(texto) ||
        prod.categoria?.nombre?.toLowerCase().includes(texto);

      const coincideCategoria = (
        filtros.categorias.length === 0 || filtros.categorias.includes(prod.categoria?.id_categoria)
      );

      const coincideMarca = !filtros.marca || prod.marca === filtros.marca;
      const coincideMililitros = filtros.ml.length === 0 || filtros.ml.includes(prod.ml);
      const coincidePrecio = prod.precio >= filtros.precio[0] && prod.precio <= filtros.precio[1];

      return coincideBusqueda && coincideCategoria && coincideMarca && coincideMililitros && coincidePrecio;
    });
  };

  const handleFiltrosChange = (nuevosFiltros) => setFiltros(nuevosFiltros);
  const handleBusqueda = (texto) => setBusqueda(texto);
  const toggleFormulario = () => {
    setProductoEditando(null);
    setMostrarFormulario(true);
  };
  const manejarEditarProducto = (producto) => {
    setProductoEditando(producto);
    setMostrarFormulario(true);
  };

  return (
    <>
      <CargandoPerfume visible={cargando} />
      <div style={{ opacity: cargando ? 0 : 1, transition: 'opacity 0.4s ease' }}>
        <div className="tienda-container">
          <div className="row g-0">
            <div className="col-md-3 col-12 mb-4">
              <Filtros productos={productos} onFiltro={handleFiltrosChange} />
            </div>

            <div className="col-md-9 col-12 d-flex flex-column">
              <TituloSeccion texto="Niebla Fragante" />

              <div className="search-container mb-3">
                <Searchbar
                  valor={busqueda}
                  onChange={handleBusqueda}
                  placeholder="Buscar productos..."
                />
              </div>

              <div className="mb-3 d-md-none">
                <button
                  className="filtro-toggle btn btn-outline-light"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasFiltros"
                  aria-controls="offcanvasFiltros"
                  type="button"
                >
                  <span className="icono-hamburguesa"></span>
                </button>
              </div>

              <div className="productos-scroll flex-grow-1">
                <GridProductos
                  productos={productosFiltrados}
                  esAdmin={esTipoB}
                  onUpdate={(productoActualizado) => {
                    setProductos(productos.map(p =>
                      p.idProducto === productoActualizado.idProducto ? productoActualizado : p
                    ));
                  }}
                  onAgregarProducto={toggleFormulario}
                  onEditarProducto={manejarEditarProducto}
                  onRenderizado={() => setTimeout(() => setCargando(false), 300)}
                />
              </div>
            </div>
          </div>

          {mostrarFormulario && (
            <FormularioProducto
              productoInicial={productoEditando}
              onClose={() => {
                setMostrarFormulario(false);
                setProductoEditando(null);
              }}
              onProductoCreado={(producto) => {
                const yaExiste = productos.some(p => p.idProducto === producto.idProducto);
                if (yaExiste) {
                  setProductos(productos.map(p => (p.idProducto === producto.idProducto ? producto : p)));
                } else {
                  setProductos([...productos, producto]);
                }
                setMostrarFormulario(false);
                setProductoEditando(null);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
