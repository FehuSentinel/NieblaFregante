import nodemailer from 'nodemailer';

// ✅ Configurar transporte con Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// 🎟️ CORREO: Compra de NÚMEROS de RIFA
export default async function enviarCorreosCompra({ correoCliente, numeros, total, cliente }) {
  const asuntoCliente = '🎟️ ¡Gracias por tu compra en Niebla Fragante!';
  const asuntoTienda = '🎯 Nueva compra de números de rifa';

  const listaNumeros = numeros.join(', ');

  const mensajeCliente = `
    <div style="font-family: sans-serif;">
      <h2>¡Hola ${cliente.nombre}!</h2>
      <p>🎉 Gracias por participar en nuestra rifa de <strong>Niebla Fragante</strong>.</p>
      <p>Hemos recibido tu compra y te confirmamos que ya estás participando.</p>
      <p><strong>Números comprados:</strong> ${listaNumeros}</p>
      <p><strong>Total pagado:</strong> $${total}</p>
      <br/>
      <p>🍀 ¡Te deseamos mucha suerte!</p>
      <p style="font-style: italic;">Mantente atento a nuestras redes para conocer al ganador</p>
      <hr/>
      <p>Con cariño,<br/>El equipo de <strong>Niebla Fragante</strong> 🌸</p>
    </div>
  `;

  const mensajeTienda = `
    <div style="font-family: sans-serif;">
      <h3>📢 Nueva compra de rifa registrada</h3>
      <p><strong>Usuario:</strong> ${cliente.correo}</p>
      <p><strong>Números comprados:</strong> ${listaNumeros}</p>
      <p><strong>Total pagado:</strong> $${total}</p>
      <hr/>
      <p>Verifica en el sistema para más detalles.</p>
    </div>
  `;

  // Enviar al cliente
  await transporter.sendMail({
    from: '"Niebla Fragante" <no-reply@nieblafragante.com>',
    to: correoCliente,
    subject: asuntoCliente,
    html: mensajeCliente
  });

  // Enviar a la tienda
  await transporter.sendMail({
    from: '"Niebla Fragante" <no-reply@nieblafragante.com>',
    to: process.env.CORREO_TIENDA,
    subject: asuntoTienda,
    html: mensajeTienda
  });
}

// 🛒 CORREO: Compra de PRODUCTOS
export async function enviarCorreoPedidoProducto({ correoCliente, cliente, productos, total, boleta }) {
  const asuntoCliente = '🛍️ ¡Gracias por tu compra en Niebla Fragante!';
  const asuntoTienda = '🛒 Nuevo pedido recibido';

  const productosHTML = productos.map(p =>
    `<li><strong>${p.nombre}</strong> — x${p.cantidad} — $${p.precio} c/u</li>`
  ).join('');

  const mensajeCliente = `
    <div style="font-family: sans-serif;">
      <h2>¡Hola ${cliente.nombre}!</h2>
      <p>🧴 Gracias por comprar en <strong>Niebla Fragante</strong>.</p>
      <p>Hemos recibido tu pedido y lo prepararemos lo antes posible.</p>
      <p><strong>Productos comprados:</strong></p>
      <ul>${productosHTML}</ul>
      <p><strong>Total pagado:</strong> $${total}</p>
      <p><strong>N° de boleta:</strong> ${boleta}</p>
      <br/>
      <p>📦 Te informaremos cuando esté listo para envío o retiro.</p>
      <hr/>
      <p>Con cariño,<br/>El equipo de <strong>Niebla Fragante</strong> 🌸</p>
    </div>
  `;

  const mensajeTienda = `
    <div style="font-family: sans-serif;">
      <h3>📦 NUEVO PEDIDO CONFIRMADO</h3>
      <p><strong>Cliente:</strong> ${cliente.nombre} (${correoCliente})</p>
      <p><strong>Productos:</strong></p>
      <ul>${productosHTML}</ul>
      <p><strong>Total pagado:</strong> $${total}</p>
      <p><strong>N° de boleta:</strong> ${boleta}</p>
      <hr/>
      <p>Revisa el sistema para gestionar el envío o retiro.</p>
    </div>
  `;

  await transporter.sendMail({
    from: '"Niebla Fragante" <no-reply@nieblafragante.com>',
    to: correoCliente,
    subject: asuntoCliente,
    html: mensajeCliente,
    attachments: [
      {
        filename: `boleta_${boleta}.pdf`,
        content: bufferPDF 
      }
    ]
  });

  await transporter.sendMail({
    from: '"Niebla Fragante" <no-reply@nieblafragante.com>',
    to: process.env.CORREO_TIENDA,
    subject: asuntoTienda,
    html: mensajeTienda,
    attachments: [
      {
        filename: `boleta_${boleta}.pdf`,
        content: bufferPDF
      }
    ]
  });
}

export async function enviarCorreoRecuperacion({ correo, nombre, token }) {
  const asunto = '🔐 Recuperación de contraseña - Niebla Fragante';

  const link = `${process.env.FRONTEND_URL}/reestablecer/${token}`;

  const mensaje = `
    <div style="font-family: sans-serif;">
      <h2>Hola ${nombre},</h2>
      <p>Recibimos una solicitud para recuperar tu contraseña en <strong>Niebla Fragante</strong>.</p>
      <p>Haz clic en el siguiente enlace para restablecerla:</p>
      <p><a href="${link}" target="_blank" style="color: #4CAF50;">🔗 Reestablecer contraseña</a></p>
      <p><strong>Este enlace expira en 15 minutos.</strong></p>
      <br/>
      <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
      <hr/>
      <p>Con cariño,<br/>El equipo de <strong>Niebla Fragante</strong> 🌸</p>
    </div>
  `;

  await transporter.sendMail({
    from: '"Niebla Fragante" <no-reply@nieblafragante.com>',
    to: correo,
    subject: asunto,
    html: mensaje
  });
}


export async function enviarCorreoGanador({ correo, nombre, numero, rifa, producto }) {
  const asunto = '🏆 ¡Ganaste en Niebla Fragante!';
  const asuntoTienda = '🎉 Rifa finalizada - Ganador confirmado';

  const mensajeCliente = `
    <div style="font-family: sans-serif;">
      <h2>🎉 ¡Felicidades ${nombre}!</h2>
      <p>Has ganado la rifa <strong>${rifa}</strong> de <strong>Niebla Fragante</strong>.</p>
      <p>🎁 Tu número ganador fue el <strong>${numero}</strong>.</p>
      <p>Te has llevado el premio: <strong>${producto}</strong>.</p>
      <br/>
      <p>Nos pondremos en contacto contigo para coordinar la entrega.</p>
      <hr/>
      <p>Con mucho cariño,<br/>El equipo de <strong>Niebla Fragante</strong> 🌸</p>
    </div>
  `;

  const mensajeTienda = `
    <div style="font-family: sans-serif;">
      <h3>🏆 Rifa "${rifa}" finalizada</h3>
      <p><strong>Ganador:</strong> ${nombre} (${correo})</p>
      <p><strong>Número ganador:</strong> ${numero}</p>
      <p><strong>Premio:</strong> ${producto}</p>
      <hr/>
      <p>Verifica en el sistema para coordinar la entrega.</p>
    </div>
  `;

  await transporter.sendMail({
    from: '"Niebla Fragante" <no-reply@nieblafragante.com>',
    to: correo,
    subject: asunto,
    html: mensajeCliente
  });

  await transporter.sendMail({
    from: '"Niebla Fragante" <no-reply@nieblafragante.com>',
    to: process.env.CORREO_TIENDA,
    subject: asuntoTienda,
    html: mensajeTienda
  });
}


