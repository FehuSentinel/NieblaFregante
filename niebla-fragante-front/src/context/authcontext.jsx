import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const EXPIRACION_MS = 60 * 60 * 1000; // 1 hora en milisegundos

  useEffect(() => {
    const data = localStorage.getItem('usuario');
    const storedToken = localStorage.getItem('token');
    
    console.log('🔍 AuthContext useEffect - data:', data);
    console.log('🔍 AuthContext useEffect - storedToken:', storedToken);
    
    if (data && storedToken) {
      const parsed = JSON.parse(data);
      const expiracion = parsed.expiraEn;

      console.log('🔍 AuthContext - expiracion:', expiracion);
      console.log('🔍 AuthContext - Date.now():', Date.now());

      // Si está expirado, desloguea
      if (expiracion && Date.now() > expiracion) {
        console.log('❌ Token expirado, deslogueando');
        logout(true);
      } else {
        console.log('✅ Token válido, estableciendo usuario y token');
        setUsuario(parsed);
        setToken(storedToken);

        // Si no ha expirado, programa el logout automático
        const tiempoRestante = expiracion - Date.now();
        setTimeout(() => logout(true), tiempoRestante);
      }
    } else {
      console.log('❌ No hay datos de usuario o token en localStorage');
    }
  }, []);

  const login = (usuarioData, authToken) => {
    const expiracion = Date.now() + EXPIRACION_MS;
    const usuarioConExpiracion = { ...usuarioData, expiraEn: expiracion };

    localStorage.setItem('usuario', JSON.stringify(usuarioConExpiracion));
    if (authToken) {
      localStorage.setItem('token', authToken);
      setToken(authToken);
    }
    setUsuario(usuarioConExpiracion);

    // Agrega logout automático
    setTimeout(() => logout(true), EXPIRACION_MS);
  };

  const logout = (forzarRecarga = false) => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    setUsuario(null);
    setToken(null);
    if (forzarRecarga) {
      window.location.reload();
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
