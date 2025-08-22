import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { AuthContext } from '../../context/authcontext';
import { CarritoProductosContext } from '../../context/CarritoProductosContext';
import Carrito from '../dashboards/carrito/carrito';

export default function Navbar() {
  const { usuario, logout } = useContext(AuthContext);
  const { carrito } = useContext(CarritoProductosContext);
  const [mostrarFlotante, setMostrarFlotante] = useState(false);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const navigate = useNavigate();

  const cerrarSesion = () => {
    logout();
    setMostrarFlotante(false);
    mostrarToastCierre();
    setTimeout(() => {
      navigate('/');
      window.location.reload();
    }, 1000);
  };

  const mostrarToastCierre = () => {
    const toast = document.createElement('div');
    toast.className = 'toast fade show position-fixed top-0 start-50 translate-middle-x mt-4';
    toast.style.zIndex = '99999';
    toast.style.backgroundColor = '#40140A';
    toast.style.color = '#F2CEA2';
    toast.style.padding = '1rem 2rem';
    toast.style.borderRadius = '12px';
    toast.style.boxShadow = '0 4px 10px rgba(0,0,0,0.5)';
    toast.innerText = 'Sesión cerrada correctamente';

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hide');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 500);
    }, 2500);
  };

  const redirigir = (ruta) => {
    const el = document.getElementById('offcanvasNavbar');
    const instancia = window.bootstrap?.Offcanvas.getInstance(el);

    if (instancia) {
      el.addEventListener(
        'hidden.bs.offcanvas',
        () => {
          navigate(ruta);
        },
        { once: true }
      );
      instancia.hide();
    } else {
      navigate(ruta);
    }
  };

  const cantidadCarrito = carrito.reduce((acc, p) => acc + p.cantidad, 0);

  return (
    <>
      <Carrito mostrar={mostrarCarrito} onClose={() => setMostrarCarrito(false)} />

      <nav className="navbar navbar-expand-lg navbar-dark custom-navbar w-100">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span className="navbar-brand d-flex align-items-center m-0">
            <img src="/src/assets/vites.jpg" alt="Logo" style={{ height: '50px', borderRadius: '25px' }} />
            <span className="ms-2 titulo-navbar">Niebla Fragante</span>
          </span>

          {/* Botones en móvil */}
          <div className="d-flex align-items-center gap-2 d-lg-none">
            <button
              className="btn nav-btn btn-carrito-movil position-relative"
              onClick={() => setMostrarCarrito(true)}
            >
              <i className="bi bi-cart-fill"></i>
              {cantidadCarrito > 0 && (
                <span className="badge-carrito">{cantidadCarrito}</span>
              )}
            </button>


            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasNavbar"
              aria-controls="offcanvasNavbar"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          {/* Menú Offcanvas */}
          <div
            className="offcanvas offcanvas-end bg-dark text-white"
            tabIndex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className="offcanvas-header mx-2">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menú</h5>
              <button
                type="button"
                className="btn-close btn-close-white mx-2"
                data-bs-dismiss="offcanvas"
                aria-label="Cerrar"
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item mx-2">
                  <button className="btn nav-btn w-100 my-1" onClick={() => redirigir('/')}>
                    <i className="bi bi-house-door-fill me-1"></i> Home
                  </button>
                </li>
                <li className="nav-item mx-2">
                  <button className="btn nav-btn w-100 my-1" onClick={() => redirigir('/tienda')}>
                    <i className="bi bi-bag-fill me-1"></i> Tienda
                  </button>
                </li>
                <li className="nav-item mx-2">
                  <button className="btn nav-btn w-100 my-1" onClick={() => redirigir('/nosotros')}>
                    <i className="bi bi-people-fill me-1"></i> Nosotros
                  </button>
                </li>
                <li className="nav-item mx-2 d-none d-lg-block">
                  <button
                    className="btn nav-btn w-100 my-1"
                    onClick={() => setMostrarCarrito(true)}
                  >
                    <i className="bi bi-cart-fill me-1"></i> Carrito
                    {cantidadCarrito > 0 && (
                      <span className="badge-carrito-inline">({cantidadCarrito})</span>
                    )}
                  </button>
                </li>

                {usuario ? (
                  <li className="nav-item mx-2 position-relative">
                    <button
                      className="btn nav-btn w-100 my-1"
                      onClick={() => setMostrarFlotante(!mostrarFlotante)}
                    >
                      <i className="bi bi-person-circle me-1"></i> {usuario.nombre || 'Cuenta'}
                    </button>

                    {mostrarFlotante && (
                      <div className="dropdown-flotante">
                        <button className="dropdown-item" onClick={() => redirigir('/perfil')}>
                          Perfil
                        </button>
                        <button className="dropdown-item" onClick={cerrarSesion}>
                          Cerrar sesión
                        </button>
                      </div>
                    )}
                  </li>
                ) : (
                  <li className="nav-item mx-2">
                    <button className="btn nav-btn w-100 my-1" onClick={() => redirigir('/login')}>
                      <i className="bi bi-person-circle me-1"></i> Login
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
