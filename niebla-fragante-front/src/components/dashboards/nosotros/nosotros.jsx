import { motion } from "framer-motion";
import './nosotros.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

export default function Nosotros() {
  return (
    <section className="nosotros-section">
      <div className="nosotros-container">
        <motion.h2
          className="nosotros-title"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          ✨ Nosotros - Niebla Fragante
        </motion.h2>

        {[
          "Niebla Fragante nació como un proyecto de amor y emprendimiento entre mi pareja y yo. Compartimos una pasión por los perfumes, por eso decidimos acercar fragancias originales a precios justos, con una atención cercana y dedicada.",
          "Cada producto que ofrecemos está elegido con cariño, pensando en que vivas una experiencia sensorial única.",
        ].map((text, i) => (
          <motion.p
            key={i}
            className="nosotros-parrafo"
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            {text}
          </motion.p>
        ))}

        <hr className="nosotros-divider" />

        {[
          {
            title: "🛒 Políticas de Compra",
            items: [
              "Todos los perfumes que vendemos son originales, en formato de reventa, pudiendo provenir de colecciones pasadas, testers o importaciones paralelas.",
              "El stock es limitado. Si un producto se agota luego de tu compra, te contactaremos para darte opciones de reembolso o cambio.",
              "Si hubiera un error en la descripción o precio del producto, te avisaremos antes de procesar tu pedido.",
            ],
          },
          {
            title: "💳 Formas de Pago",
            items: [
              "Puedes pagar con tarjetas de débito/crédito vía Webpay o mediante transferencia bancaria.",
              "Si eliges pagar por transferencia, deberás enviar el comprobante en un plazo de 24 horas, de lo contrario el pedido será cancelado.",
            ],
          },
          {
            title: "🚚 Políticas de Entrega",
            items: [
              "Realizamos entregas exclusivamente dentro de la comuna de Santiago Centro.",
              "El despacho se efectúa en un plazo de 24 a 72 horas hábiles desde la confirmación del pago.",
              "Nos pondremos en contacto contigo para coordinar el horario y dirección exacta. Es importante que estés disponible para recibirlo.",
            ],
          },
          {
            title: "📍 Retiro en Punto",
            items: [
              "Puedes coordinar con nosotros un retiro en punto acordado dentro de Santiago Centro sin costo adicional.",
              "Una vez esté listo tu pedido, tendrás 5 días hábiles para retirarlo.",
            ],
          },
          {
            title: "🔁 Cambios y Devoluciones",
            items: [
              "No aceptamos devoluciones, salvo que el producto haya llegado dañado durante la entrega.",
              "Si eso ocurre, debes avisarnos dentro de las 24 horas posteriores a recibirlo, enviando una foto como respaldo.",
              "No se realizan cambios por preferencias personales como aroma no esperado.",
            ],
          },
        ].map((section, i) => (
          <motion.div
            key={section.title}
            className="nosotros-bloque"
            custom={i + 2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h3 className="nosotros-subtitulo">{section.title}</h3>
            <ul className="nosotros-lista">
              {section.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </motion.div>
        ))}

        <motion.div
          className="nosotros-bloque"
          custom={7}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h3 className="nosotros-subtitulo">📄 Comprobantes y Boleta</h3>
          <p>
            En Niebla Fragante cada compra incluye su <strong>boleta digital</strong>. Si deseas una{" "}
            <strong>factura</strong>, por favor solicítala <strong>antes de realizar el pago</strong>.
          </p>
        </motion.div>

        <motion.div
          className="nosotros-bloque"
          custom={8}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h3 className="nosotros-subtitulo">📞 Atención al Cliente</h3>
          <p>Para dudas o consultas, puedes escribirnos a:</p>
          <p>📧 <strong>nieblafragante@gmail.cl</strong></p>
          <p>📱 <strong>WhatsApp: +56 9 79850943</strong></p>
          <p>🕐 Horario: <strong>lunes a viernes de 10:00 a 18:00 hrs.</strong></p>
        </motion.div>
      </div>
    </section>
  );
}
