import PDFDocument from 'pdfkit';
import getStream from 'get-stream'; 

export async function generarBoletaPDFBuffer({ boleta, cliente, productos, total }) {
  const doc = new PDFDocument();

  // Encabezado
  doc.fontSize(20).text('Boleta Electrónica - Niebla Fragante', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Cliente: ${cliente.nombre}`);
  doc.text(`Correo: ${cliente.correo}`);
  doc.text(`Boleta Nº: ${boleta.idBoleta || boleta.folio}`);
  doc.text(`Fecha: ${new Date().toLocaleString()}`);
  doc.moveDown();

  // Detalle
  doc.fontSize(14).text('Detalle de productos:');
  productos.forEach(p => {
    doc.fontSize(12).text(`• ${p.nombre} — x${p.cantidad} — $${p.precio} c/u`);
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total pagado: $${total}`, { align: 'right' });

  doc.end();

  // Convertir PDF stream en buffer para adjuntar
  const buffer = await getStream.buffer(doc);
  return buffer;
}
