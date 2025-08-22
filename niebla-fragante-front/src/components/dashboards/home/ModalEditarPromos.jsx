import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cropper from 'react-easy-crop';
import getCroppedImg from './getCroppedImg'; // ➕ Función auxiliar para extraer el crop
import './modaleditarpromos.css';

export default function ModalEditarPromos({ onClose }) {
  const [imagenes, setImagenes] = useState([]);
  const [nuevas, setNuevas] = useState([]);
  const [preview, setPreview] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };

  useEffect(() => {
    const fetchImagenes = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/promos`);
        setImagenes(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error al obtener imágenes', err);
      }
    };
    fetchImagenes();
  }, []);

  const eliminarImagen = async (nombre) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/promos/${nombre}`, authHeaders);
      setImagenes((prev) => prev.filter((img) => img.nombre !== nombre));
    } catch (err) {
      console.error('Error al eliminar imagen', err);
    }
  };

  const handleSubida = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setPreview(URL.createObjectURL(archivo));
      setNuevas([archivo]);
    }
  };

  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const guardarCambios = async () => {
    try {
      if (preview && nuevas.length) {
        const recortada = await getCroppedImg(preview, croppedAreaPixels);
        const formData = new FormData();
        formData.append('imagen', recortada, nuevas[0].name);

        await axios.post(`${import.meta.env.VITE_API_URL}/promos`, formData, authHeaders);
      }
      onClose();
    } catch (err) {
      console.error('Error al subir imagen recortada', err);
    }
  };

  const handleClickFondo = (e) => {
    if (e.target.classList.contains('formulario-envio-overlay')) {
      onClose();
    }
  };

  return (
    <div
      className="formulario-envio-overlay"
      onClick={handleClickFondo}
    >
      <div className="formulario-envio-modal" onClick={(e) => e.stopPropagation()}>
        <button className="cerrar-modal" onClick={onClose}>✖</button>

        <h3>Editar Imágenes Promocionales</h3>

        <div className="d-flex flex-wrap gap-3 mb-3 justify-content-center">
          {imagenes.map((img) => (
            <div key={img.nombre} className="position-relative">
              <img
                src={`${import.meta.env.VITE_MEDIA_URL}/uploads/promociones/${img.nombre}`}
                alt="Promo"
                style={{ width: '140px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <button
                className="btn btn-sm btn-danger position-absolute top-0 end-0"
                onClick={() => eliminarImagen(img.nombre)}
              >
                ✖
              </button>
            </div>
          ))}
        </div>

        <div className="formulario-envio">
          <input type="file" onChange={handleSubida} accept="image/*" />

          {preview && (
            <div style={{ position: 'relative', width: '100%', height: 300, marginBottom: '1rem' }}>
              <Cropper
                image={preview}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
          )}

          <button className="pagar" onClick={guardarCambios} disabled={!preview}>
            💾 Guardar Imagen
          </button>
        </div>
      </div>
    </div>
  );
}
