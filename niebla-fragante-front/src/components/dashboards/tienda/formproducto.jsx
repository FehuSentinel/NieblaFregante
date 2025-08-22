import React, { useState, useEffect } from 'react';
import './formproducto.css';
import API from '../../../api';

export default function FormularioProducto({ onClose, onProductoCreado, productoInicial = null }) {
  const [formData, setFormData] = useState({
    nombre: productoInicial?.nombre || '',
    descripcion: productoInicial?.descripcion || '',
    marca: productoInicial?.marca || '',
    categoria: productoInicial?.id_categoria || '',
    ml: productoInicial?.ml || '',
    stock: productoInicial?.stock || '',
    precio: productoInicial?.precio || '',
    enPromocion: productoInicial?.enPromocion || false,
    porcentajeDescuento: productoInicial?.porcentajeDescuento || '',
    imagen: null,
  });

  const [categorias, setCategorias] = useState([]);
  const [preview, setPreview] = useState(null);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const { data } = await API.get('/categorias');
        setCategorias(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    fetchCategorias();

    if (productoInicial?.imagenUrl) {
      setPreview(`${import.meta.env.VITE_MEDIA_URL}/uploads/images/${productoInicial.imagenUrl}`);
    }
  }, [productoInicial]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'precio' || name === 'porcentajeDescuento') {
      const raw = value.replace(/\D/g, '');
      const number = parseInt(raw || '0');
      setFormData(prev => ({ ...prev, [name]: number }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imagen: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setAlert({ message: 'No estás autenticado', type: 'error' });
      setLoading(false);
      return;
    }

    const data = new FormData();
    for (let key in formData) {
      if (key === 'imagen' && formData.imagen) {
        data.append('imagen', formData.imagen);
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      let response;
      if (productoInicial) {
        response = await API.put(`/productos/${productoInicial.idProducto}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await API.post('/productos', data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setAlert({ message: 'Producto guardado correctamente', type: 'success' });

      if (onProductoCreado) {
        onProductoCreado(response.data);
      }

      setTimeout(() => {
        setAlert({ message: '', type: '' });
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error al guardar producto:', error);
      let errorMessage = 'Error al guardar producto';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      setAlert({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-producto-card" onClick={(e) => e.stopPropagation()}>
        <button className="cerrar-formulario" onClick={onClose}>✖</button>

        <h5 className="text-center mb-3">
          {productoInicial ? `Editando: ${productoInicial.nombre}` : 'Nuevo Producto'}
        </h5>

        {alert.message && (
          <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {alert.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-column">
            <input
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={formData.descripcion}
              onChange={handleChange}
              rows="3"
            />
            <input
              name="marca"
              placeholder="Marca"
              value={formData.marca}
              onChange={handleChange}
            />
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map(cat => (
                <option key={cat.id_categoria} value={cat.id_categoria}>
                  {cat.nombre}
                </option>
              ))}
            </select>
            <input
              name="ml"
              type="number"
              placeholder="Mililitros"
              value={formData.ml}
              onChange={handleChange}
              required
            />
            <input
              name="stock"
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
              onWheel={(e) => e.target.blur()}
              required
            />
          </div>

          <div className="form-column">
            <div className="input-con-simbolo">
              <span className="simbolo">$</span>
              <input
                name="precio"
                type="text"
                placeholder="Precio CLP"
                value={formData.precio.toLocaleString('es-CL')}
                onChange={handleChange}
                onWheel={(e) => e.target.blur()}
                required
              />
            </div>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="enPromocion"
                checked={formData.enPromocion}
                onChange={handleChange}
              />
              En promoción
            </label>

            {formData.enPromocion && (
              <div className="input-con-simbolo">
                <span className="simbolo">%</span>
                <input
                  name="porcentajeDescuento"
                  type="text"
                  placeholder="Descuento (%)"
                  value={formData.porcentajeDescuento}
                  onChange={handleChange}
                  onWheel={(e) => e.target.blur()}
                  min="1"
                  max="99"
                  required
                />
              </div>
            )}

            <div className="image-upload-container">
              <input
                type="file"
                name="imagen"
                accept="image/*"
                onChange={handleFileChange}
                className="image-input"
                required={!productoInicial}
              />
              {preview && (
                <img src={preview} alt="Vista previa" className="image-preview" />
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn nav-btn w-100"
            disabled={loading}
          >
            {loading ? 'Guardando...' : (productoInicial ? 'Actualizar Producto' : 'Registrar Producto')}
          </button>
        </form>
      </div>
    </div>
  );
}
