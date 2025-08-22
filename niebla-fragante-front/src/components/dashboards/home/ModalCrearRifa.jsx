// src/components/Home/ModalCrearRifa.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ModalCrearRifa.css';

export default function ModalCrearRifa({ mostrar, onClose, onRifaCreada }) {
    const [productos, setProductos] = useState([]);
    const [formulario, setFormulario] = useState({
        nombre: '',
        id_producto_premio: '',
        precioNumero: '',
        fechaSorteo: '',
        cantidadNumeros: ''
    });

    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/productos`);
                console.table(data); // ✅ Para revisar los campos
                setProductos(data);
            } catch (err) {
                console.error('Error al cargar productos:', err);
            }
        };

        if (mostrar) obtenerProductos();
    }, [mostrar]);

    const handleChange = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL}/rifas`, formulario, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('✅ Rifa creada correctamente');
            onRifaCreada();
            onClose();
        } catch (err) {
            console.error('❌ Error al crear rifa:', err);
            alert('Error al crear rifa');
        }
    };

    if (!mostrar) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-rifa" onClick={(e) => e.stopPropagation()}>
                <button className="cerrar-modal" onClick={onClose}>✖</button>
                <h3 className="mb-3">Crear Nueva Rifa</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="form-control mb-2"
                        name="nombre"
                        placeholder="Nombre de la rifa"
                        onChange={handleChange}
                        required
                    />

                    <select
                        className="form-control mb-2"
                        name="id_producto_premio"
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona un producto</option>
                        {productos.map((p) => {
                            try {
                                if (!p || !p.idProducto || !p.nombre) {
                                    console.warn('Producto inválido:', p);
                                    return null;
                                }

                                const nombre = p.nombre;
                                const categoria = p.categoria?.nombre || 'Sin categoría';
                                const ml = p.ml != null ? `${p.ml} ml` : 'ml desconocidos';

                                return (
                                    <option key={p.idProducto} value={p.idProducto}>
                                        {nombre} — {categoria} — {ml}
                                    </option>
                                );
                            } catch (err) {
                                console.error('Error al renderizar producto:', p, err);
                                return null;
                            }
                        })}

                    </select>

                    <input
                        type="number"
                        className="form-control mb-2"
                        name="precioNumero"
                        placeholder="Precio por número"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        className="form-control mb-2"
                        name="cantidadNumeros"
                        placeholder="Cantidad total de números"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="date"
                        className="form-control mb-3"
                        name="fechaSorteo"
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="btn btn-success w-100">Crear Rifa</button>
                </form>
            </div>
        </div>
    );
}
