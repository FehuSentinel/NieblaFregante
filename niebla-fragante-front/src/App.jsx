import { Routes, Route } from 'react-router-dom';

import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';
import Home from './components/dashboards/home/home';
import Login from './components/dashboards/user/login';
import Registro from './components/dashboards/user/registro';
import Perfil from './components/dashboards/user/perfil';
import Tienda from './components/dashboards/tienda/tienda';
import DetalleCarrito from './components/dashboards/carrito/detallecarrito';
import { AuthProvider } from './context/authcontext';
import { CarritoProvider } from '/src/context/CarritoProductosContext.jsx';
import Nosotros from './components/dashboards/nosotros/nosotros';

import { CarritoRifaProvider } from '/src/context/CarritoRifaContext.jsx';


export default function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <CarritoRifaProvider>
          <div className="app-background d-flex flex-column min-vh-100">
            <Navbar />

            <main className="container mx-auto p-4 flex-grow-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/tienda" element={<Tienda />} />
                <Route path="/detallecarrito" element={<DetalleCarrito />} />
                <Route path='/nosotros' element={<Nosotros/>} />

    
              </Routes>
            </main>

            <Footer />
          </div>
        </CarritoRifaProvider>
      </CarritoProvider>
    </AuthProvider>
  );
}
