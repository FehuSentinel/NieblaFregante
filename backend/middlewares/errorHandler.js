// Middleware para manejar errores globales en Express
const errorHandler = (err, req, res, next) => {
    console.error("🔴 Error en el servidor:", err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Error interno del servidor'
    });
};

export default errorHandler;