// ⚙️ Función para recortar la imagen con canvas según selección del usuario
export default async function getCroppedImg(imageSrc, croppedAreaPixels) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );

  // 🔍 DEBUG VISUAL: ver lo que se va a subir
  const previewURL = canvas.toDataURL('image/jpeg');
  const imgPreview = document.createElement('img');
  imgPreview.src = previewURL;
  imgPreview.style = 'position:fixed;top:10px;right:10px;width:180px;border:2px solid red;z-index:9999';
  document.body.appendChild(imgPreview);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('❌ No se pudo generar el blob de la imagen'));
        return;
      }
      const file = new File([blob], 'recorte.jpg', { type: 'image/jpeg' });
      resolve(file);
    }, 'image/jpeg');
  });
}

// 🔄 Carga una imagen desde un src
function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    // Solo aplicar crossOrigin si la URL no es un blob local
    if (!url.startsWith('blob:')) {
      image.setAttribute('crossOrigin', 'anonymous');
    }

    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (err) => reject(err));
    image.src = url;
  });
}
