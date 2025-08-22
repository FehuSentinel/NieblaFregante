// config/transbank.js
import pkg from 'transbank-sdk';
const { WebpayPlus } = pkg;

// Configurar entorno de integración
//    WebpayPlus.configureForIntegration(
//    process.env.WEBPAY_COMMERCE_CODE || '597055555532',
//    process.env.WEBPAY_API_KEY || ''
//    );
WebpayPlus.configureForTesting();

export { WebpayPlus };
