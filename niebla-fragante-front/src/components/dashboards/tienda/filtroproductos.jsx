import React, { useState, useEffect } from 'react';
import './filtroProductos.css';

export default function FiltroProductos({ productos, onFiltro }) {
  const [filtros, setFiltros] = useState({
    categorias: [],
    marca: '',
    ml: [],
    precio: [0, 300000],
  });

  const [rangoPrecio] = useState([0, 300000]);

  const marcasUnicas = [...new Set(productos.map(p => p.marca))];
  const mlUnicos = [...new Set(productos.map(p => p.ml))].sort((a, b) => a - b);

  const categoriasUnicas = [
    ...new Map(
      productos
        .filter(p => p.categoria?.id_categoria && p.categoria?.nombre)
        .map(p => [p.categoria.id_categoria, p.categoria])
    ).values()
  ];

  const toggleCategoria = (catId) => {
    setFiltros(f => {
      const nueva = f.categorias.includes(catId)
        ? f.categorias.filter(c => c !== catId)
        : [...f.categorias, catId];
      return { ...f, categorias: nueva };
    });
  };

  const toggleML = (ml) => {
    setFiltros(f => {
      const nueva = f.ml.includes(ml)
        ? f.ml.filter(m => m !== ml)
        : [...f.ml, ml];
      return { ...f, ml: nueva };
    });
  };

  const cambiarPrecio = (e, i) => {
    const nuevo = [...filtros.precio];
    nuevo[i] = Number(e.target.value);
    setFiltros(f => ({ ...f, precio: nuevo }));
  };

  const limpiar = () => {
    setFiltros({
      categorias: [],
      marca: '',
      ml: [],
      precio: [...rangoPrecio],
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      onFiltro(filtros);
    }, 100);
    return () => clearTimeout(timeout);
  }, [filtros]);

  useEffect(() => {
    const handleBackdropCleanup = () => {
      const backdrop = document.querySelector('.offcanvas-backdrop');
      if (backdrop) backdrop.remove();
      document.body.classList.remove('offcanvas-backdrop', 'modal-open');
    };

    const el = document.getElementById('offcanvasFiltros');
    if (el) {
      el.addEventListener('hidden.bs.offcanvas', handleBackdropCleanup);
      return () => el.removeEventListener('hidden.bs.offcanvas', handleBackdropCleanup);
    }
  }, []);

  return (
    <>
      {/* Offcanvas para móviles */}
      <div
        className="offcanvas offcanvas-start bg-black text-white"
        tabIndex="-1"
        id="offcanvasFiltros"
        aria-labelledby="offcanvasFiltrosLabel"
      >
        <div className="offcanvas-header bg-black text-white">
          <h5 className="offcanvas-title" id="offcanvasFiltrosLabel">Filtros</h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Cerrar"
          ></button>
        </div>

        <div className="offcanvas-body overflow-auto px-3 py-2" style={{ paddingTop: '1rem' }}>
          <FiltroContenido
            filtros={filtros}
            marcasUnicas={marcasUnicas}
            mlUnicos={mlUnicos}
            categoriasUnicas={categoriasUnicas}
            rangoPrecio={rangoPrecio}
            cambiarPrecio={cambiarPrecio}
            toggleCategoria={toggleCategoria}
            toggleML={toggleML}
            setFiltros={setFiltros}
            limpiar={limpiar}
          />
        </div>
      </div>

      {/* Filtros fijos para pantallas medianas en adelante */}
      <div className="filtro-container d-none d-md-block bg-black text-white p-3 rounded-3 shadow-sm mt-4">
        <h5 className="mb-3">Filtros</h5>
        <FiltroContenido
          filtros={filtros}
          marcasUnicas={marcasUnicas}
          mlUnicos={mlUnicos}
          categoriasUnicas={categoriasUnicas}
          rangoPrecio={rangoPrecio}
          cambiarPrecio={cambiarPrecio}
          toggleCategoria={toggleCategoria}
          toggleML={toggleML}
          setFiltros={setFiltros}
          limpiar={limpiar}
        />
      </div>
    </>
  );
}

function FiltroContenido({
  filtros,
  marcasUnicas,
  mlUnicos,
  categoriasUnicas,
  rangoPrecio,
  cambiarPrecio,
  toggleCategoria,
  toggleML,
  setFiltros,
  limpiar
}) {
  return (
    <>
      <div className="filtro-seccion p-3 mb-4 rounded-3">
        <strong>Categorías</strong>
        <div className="d-flex flex-column gap-2 mt-2">
          {categoriasUnicas.map(cat => (
            <div key={cat.id_categoria} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`cat-${cat.id_categoria}`}
                checked={filtros.categorias.includes(cat.id_categoria)}
                onChange={() => toggleCategoria(cat.id_categoria)}
              />
              <label className="form-check-label" htmlFor={`cat-${cat.id_categoria}`}>
                {cat.nombre}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="filtro-seccion p-3 mb-4 rounded-3">
        <strong>Marca</strong>
        <div className="filtro-scroll-list d-flex flex-column gap-2 mt-2">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="marca"
              id="marca-todas"
              value=""
              checked={filtros.marca === ''}
              onChange={() => setFiltros(f => ({ ...f, marca: '' }))}
            />
            <label className="form-check-label" htmlFor="marca-todas">
              Todas
            </label>
          </div>
          {marcasUnicas.map(marca => (
            <div key={marca} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="marca"
                id={`marca-${marca}`}
                value={marca}
                checked={filtros.marca === marca}
                onChange={() => setFiltros(f => ({ ...f, marca }))}
              />
              <label className="form-check-label" htmlFor={`marca-${marca}`}>
                {marca}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="filtro-seccion p-3 mb-4 rounded-3">
        <strong>Mililitros</strong>
        <div className="filtro-scroll-list d-flex flex-column gap-2 mt-2">
          {mlUnicos.map(m => (
            <div key={m} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`ml-${m}`}
                checked={filtros.ml.includes(m)}
                onChange={() => toggleML(m)}
              />
              <label className="form-check-label" htmlFor={`ml-${m}`}>{m} ml</label>
            </div>
          ))}
        </div>
      </div>

      <div className="filtro-seccion p-3 mb-4 rounded-3">
        <strong>Precio</strong>
        <div className="mt-2">
          <label className="form-label">Desde: CLP${filtros.precio[0].toLocaleString('es-CL')}</label>
          <input
            type="range"
            min={rangoPrecio[0]}
            max={rangoPrecio[1]}
            step={1000}
            value={filtros.precio[0]}
            onChange={(e) => cambiarPrecio(e, 0)}
            className="form-range"
          />
          <label className="form-label mt-2">Hasta: CLP${filtros.precio[1].toLocaleString('es-CL')}</label>
          <input
            type="range"
            min={rangoPrecio[0]}
            max={rangoPrecio[1]}
            step={1000}
            value={filtros.precio[1]}
            onChange={(e) => cambiarPrecio(e, 1)}
            className="form-range"
          />
        </div>
      </div>

      <button
        className="btn nav-btn w-100 mt-3 shadow-sm"
        data-bs-dismiss="offcanvas"
        onClick={limpiar}
      >
        <i className="bi bi-x-circle me-2"></i> Limpiar Filtros
      </button>
    </>
  );
}
