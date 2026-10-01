const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const database = require('./database');

/**
 * Sanitizes text to prevent unicode character corruption in standard PDF Helvetica font.
 * Fixes double UTF-8 mojibake, strips emojis, converts accents to plain ASCII,
 * and guarantees 100% clean rendering without percent signs or unprintable glyphs.
 */
function sanitizeText(str) {
  if (!str) return '';
  let s = String(str);

  // Fix UTF-8 double-encoding mojibake commonly found in database strings
  s = s
    .replace(/Ã¡/g, 'a').replace(/Ã©/g, 'e').replace(/Ã­/g, 'i').replace(/Ã³/g, 'o').replace(/Ãº/g, 'u')
    .replace(/Ã /g, 'A').replace(/Ã‰/g, 'E').replace(/Ã /g, 'I').replace(/Ã“/g, 'O').replace(/Ãš/g, 'U')
    .replace(/Ã±/g, 'n').replace(/Ã‘/g, 'N')
    .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u')
    .replace(/Á/g, 'A').replace(/É/g, 'E').replace(/Í/g, 'I').replace(/Ó/g, 'O').replace(/Ú/g, 'U')
    .replace(/ñ/g, 'n').replace(/Ñ/g, 'N');

  // Strip emojis, unicode arrows, special punctuation
  return s
    .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '')
    .replace(/[➔➜➝➞]/g, '->')
    .replace(/[•●▪]/g, '-')
    .replace(/[–—]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[^\x20-\x7E]/g, '') // Keep clean printable ASCII only
    .trim();
}

/**
 * Generates an ultra-professional, single-page vector PDF ticket/voucher buffer
 * for BOTH flights and excursions with Fire Tour DR branding, complete breakdown,
 * customer details, logistics, payment receipt, and scannable QR code.
 * 
 * @param {Object} reservation - The reservation object from database
 * @param {string} [baseUrl] - Base URL for the QR code target
 * @returns {Promise<Buffer>}
 */
async function generateTicketPdfBuffer(reservation, baseUrl = 'https://firetourdr.com') {
  const pnr = sanitizeText(reservation.ticketCode || reservation.flightDetails?.pnr || `FT-${reservation.id}`);
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const qrUrl = `${cleanBase}/api/reservations/${encodeURIComponent(pnr)}/pdf`;

  // Generate high-resolution QR Code
  const qrBuffer = await QRCode.toBuffer(qrUrl, {
    errorCorrectionLevel: 'H',
    type: 'png',
    margin: 1,
    width: 260,
    color: { dark: '#0a192f', light: '#ffffff' }
  });

  // A4 dimensions: 595.28 x 841.89 pt. 
  // Margin 0 with manual layout guarantees strictly 1 single page!
  const doc = new PDFDocument({
    size: 'A4',
    margin: 0,
    autoFirstPage: true
  });

  const chunks = [];
  doc.on('data', c => chunks.push(c));

  return new Promise((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const primaryNavy = '#0a192f';
    const accentOrange = '#f97316';
    const accentCyan = '#0284c7';
    const textDark = '#0f172a';
    const textMuted = '#64748b';
    const bgLight = '#f8fafc';
    const borderColor = '#cbd5e1';

    const isFlight = Boolean(reservation.flightDetails || reservation.tourId === 9999 || reservation.tourId === -1);
    const flight = reservation.flightDetails || {};

    let tour = null;
    if (!isFlight && reservation.tourId && reservation.tourId > 0) {
      try {
        tour = database.getTourById(reservation.tourId);
      } catch (e) {}
    }

    const pageWidth = doc.page.width; // 595.28
    const marginX = 36;
    const contentWidth = pageWidth - (marginX * 2); // 523.28

    // ========================================================
    // 1. TOP HEADER BANNER (Y: 0 to 86)
    // ========================================================
    doc.rect(0, 0, pageWidth, 86).fill(primaryNavy);
    doc.rect(0, 84, pageWidth, 3).fill(accentOrange);

    // Brand Name: FIRE TOUR DR
    doc.fontSize(23).font('Helvetica-Bold').fillColor('#ffffff').text('FIRE TOUR', marginX, 20, { continued: true });
    doc.fontSize(23).font('Helvetica-Bold').fillColor(accentOrange).text(' DR');

    if (isFlight) {
      doc.fontSize(8).font('Helvetica').fillColor('#94a3b8').text('SISTEMA OFICIAL DE RESERVAS Y PASE DE ABORDAJE ELECTRONICO', marginX, 47);
      doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#38bdf8').text('COMPROBANTE OFICIAL IATA / GDS · EMISION VERIFICADA', marginX, 60);
    } else {
      doc.fontSize(8).font('Helvetica').fillColor('#94a3b8').text('SISTEMA OFICIAL DE RESERVAS Y VOUCHER VIP DE EXCURSION', marginX, 47);
      doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#38bdf8').text('PASE DE ACTIVIDAD TURISTICA OFICIAL · REPUBLICA DOMINICANA', marginX, 60);
    }

    // Top Right Code Box (PNR / Ticket Code)
    const pnrBoxWidth = 160;
    const pnrBoxX = pageWidth - marginX - pnrBoxWidth;
    doc.roundedRect(pnrBoxX, 16, pnrBoxWidth, 54, 6).fill('#1e293b');
    doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#94a3b8')
       .text(isFlight ? 'LOCALIZADOR / PNR' : 'CODIGO DE TICKET / RESERVA', pnrBoxX + 12, 24);
    doc.fontSize(17).font('Helvetica-Bold').fillColor('#38bdf8')
       .text(pnr, pnrBoxX + 12, 38, { characterSpacing: 1.5 });

    let currentY = 96;

    // ========================================================
    // 2. STATUS STRIP (Y: 96 to 120)
    // ========================================================
    doc.roundedRect(marginX, currentY, contentWidth, 24, 4).fill('#ecfdf5');
    doc.roundedRect(marginX, currentY, contentWidth, 24, 4).stroke('#a7f3d0');
    
    doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#059669')
       .text(`ESTADO: ${String(reservation.status || 'CONFIRMADO').toUpperCase()} · RESERVA GARANTIZADA`, marginX + 12, currentY + 7);
    
    const referenceId = isFlight 
      ? sanitizeText(flight.duffelOrderId || `ORD-${reservation.id}`)
      : `EXCURSION-#${reservation.tourId || reservation.id}`;

    doc.fontSize(7.5).font('Helvetica').fillColor('#059669')
       .text(`Referencia: ${referenceId}`, pageWidth - marginX - 220, currentY + 7, { align: 'right', width: 208 });

    currentY += 30;

    // ========================================================
    // 3. MAIN ITINERARY / TOUR CARD
    // ========================================================
    if (isFlight) {
      // Flight Card (Height: 120)
      doc.roundedRect(marginX, currentY, contentWidth, 120, 6).fill(bgLight);
      doc.roundedRect(marginX, currentY, contentWidth, 120, 6).stroke(borderColor);

      doc.roundedRect(marginX + 12, currentY + 10, 140, 16, 3).fill('#fed7aa');
      doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#9a3412')
         .text('ITINERARIO DE VUELO', marginX + 18, currentY + 14);

      const origin = sanitizeText(flight.origin || 'MIA');
      const dest = sanitizeText(flight.destination || 'PUJ');
      const airline = sanitizeText(flight.airline || 'Aerolinea Asociada');
      const flightNum = sanitizeText(flight.flightNumber || 'Directo');

      // Origin Airport Code
      doc.fontSize(24).font('Helvetica-Bold').fillColor(textDark).text(origin, marginX + 14, currentY + 34);

      // Clean vector flight route connector line
      const lineStartX = marginX + 80;
      const lineEndX = marginX + 225;
      const lineY = currentY + 46;

      doc.save();
      doc.strokeColor(accentCyan).lineWidth(1.5).dash(4, { space: 3 })
         .moveTo(lineStartX, lineY).lineTo(lineEndX, lineY).stroke();
      doc.restore();

      // Right arrow head vector
      doc.strokeColor(accentCyan).lineWidth(1.5)
         .moveTo(lineEndX - 6, lineY - 4).lineTo(lineEndX, lineY).lineTo(lineEndX - 6, lineY + 4).stroke();

      // Direct flight pill in the center
      doc.roundedRect(marginX + 115, lineY - 8, 72, 16, 8).fill('#e0f2fe');
      doc.fontSize(7).font('Helvetica-Bold').fillColor(accentCyan).text('DIRECTO', marginX + 130, lineY - 4);

      // Destination Airport Code
      doc.fontSize(24).font('Helvetica-Bold').fillColor(textDark).text(dest, marginX + 240, currentY + 34);

      // Airline name and flight number
      doc.fontSize(9.5).font('Helvetica-Bold').fillColor(accentCyan)
         .text(`${airline} · Vuelo ${flightNum}`, marginX + 14, currentY + 64);

      // 4-column metadata
      const colY = currentY + 82;
      doc.fontSize(6.5).font('Helvetica-Bold').fillColor(textMuted).text('FECHA Y HORA DE SALIDA', marginX + 14, colY);
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(textDark).text(sanitizeText(reservation.date) || 'Confirmada', marginX + 14, colY + 10);

      doc.fontSize(6.5).font('Helvetica-Bold').fillColor(textMuted).text('DURACION ESTIMADA', marginX + 150, colY);
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(textDark).text(sanitizeText(flight.duration) || 'Vuelo Regular', marginX + 150, colY + 10);

      doc.fontSize(6.5).font('Helvetica-Bold').fillColor(textMuted).text('CLASE / CABINA', marginX + 270, colY);
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(textDark).text(sanitizeText(flight.cabin) || 'Clase Turista (Economy)', marginX + 270, colY + 10);

      doc.fontSize(6.5).font('Helvetica-Bold').fillColor(textMuted).text('EQUIPAJE PERMITIDO', marginX + 395, colY);
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(textDark).text('1x Mano + 1x Articulo', marginX + 395, colY + 10);

      currentY += 130;
    } else {
      // Excursion Card (Height: 136) with complete logistics breakdown
      doc.roundedRect(marginX, currentY, contentWidth, 136, 6).fill(bgLight);
      doc.roundedRect(marginX, currentY, contentWidth, 136, 6).stroke(borderColor);

      // Category Pill
      const categoryTag = sanitizeText(tour?.category ? `EXCURSION VIP · ${tour.category.toUpperCase()}` : 'EXCURSION VIP & AVENTURA');
      doc.roundedRect(marginX + 12, currentY + 10, 175, 16, 3).fill('#fed7aa');
      doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#9a3412')
         .text(categoryTag, marginX + 18, currentY + 14);

      // Clean Tour Name (Mojibake sanitized!)
      const cleanTourName = sanitizeText(reservation.tourName || 'Excursion Fire Tour DR Punta Cana');
      doc.fontSize(12.5).font('Helvetica-Bold').fillColor(textDark)
         .text(cleanTourName, marginX + 14, currentY + 31, { width: contentWidth - 28 });

      // 4-Column Activity Metrics
      const colY = currentY + 56;
      doc.fontSize(6.5).font('Helvetica-Bold').fillColor(textMuted).text('FECHA DEL TOUR', marginX + 14, colY);
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(textDark).text(sanitizeText(reservation.date) || 'Confirmada', marginX + 14, colY + 10);

      doc.fontSize(6.5).font('Helvetica-Bold').fillColor(textMuted).text('HORA DE RECOGIDA', marginX + 145, colY);
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(textDark).text('08:00 AM (Lobby)', marginX + 145, colY + 10);

      const durationStr = sanitizeText(tour?.duration || '4 Horas (Medio Dia)');
      doc.fontSize(6.5).font('Helvetica-Bold').fillColor(textMuted).text('DURACION ESTIMADA', marginX + 275, colY);
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(textDark).text(durationStr, marginX + 275, colY + 10);

      doc.fontSize(6.5).font('Helvetica-Bold').fillColor(textMuted).text('PARTICIPANTES', marginX + 395, colY);
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor(textDark).text(`${reservation.guests || 1} Persona(s)`, marginX + 395, colY + 10);

      // Dedicated Pickup Logistics Banner (Inside Excursion Card)
      const pickupY = currentY + 86;
      doc.roundedRect(marginX + 10, pickupY, contentWidth - 20, 42, 4).fill('#e0f2fe');
      doc.roundedRect(marginX + 10, pickupY, contentWidth - 20, 42, 4).stroke('#38bdf8');

      const hotelName = sanitizeText(reservation.hotelName) || 'Hotel / Resort en Punta Cana (Coordinar con guia)';
      const roomNum = sanitizeText(reservation.roomNumber) || 'Por confirmar en lobby';

      doc.fontSize(7).font('Helvetica-Bold').fillColor('#0369a1')
         .text('LOGISTICA DE RECOGIDA Y TRASLADO VIP:', marginX + 18, pickupY + 6);
      doc.fontSize(8).font('Helvetica-Bold').fillColor(textDark)
         .text(`Hotel / Resort: ${hotelName}   ·   Habitacion / Villa: ${roomNum}`, marginX + 18, pickupY + 17);
      doc.fontSize(6.5).font('Helvetica').fillColor('#0284c7')
         .text('Transporte oficial ida y vuelta incluido. Presentese en el lobby principal 15 minutos antes de la hora acordada.', marginX + 18, pickupY + 29);

      currentY += 144;
    }

    // ========================================================
    // 4. TWO COLUMNS: Left (Passenger & Payment) / Right (QR Code)
    // ========================================================
    const leftWidth = 330;
    const rightX = marginX + leftWidth + 14;
    const rightWidth = contentWidth - leftWidth - 14;

    // --- Left Box 1: Passenger / Client Info ---
    doc.roundedRect(marginX, currentY, leftWidth, 88, 6).fill(bgLight);
    doc.roundedRect(marginX, currentY, leftWidth, 88, 6).stroke(borderColor);

    doc.fontSize(8.5).font('Helvetica-Bold').fillColor(primaryNavy)
       .text(isFlight ? 'INFORMACION DEL PASAJERO' : 'DATOS DEL CLIENTE / TITULAR', marginX + 14, currentY + 9);

    doc.fontSize(6.5).font('Helvetica-Bold').fillColor(textMuted).text('TITULAR DE LA RESERVA:', marginX + 14, currentY + 25);
    doc.fontSize(9).font('Helvetica-Bold').fillColor(textDark).text(sanitizeText(reservation.customerName) || 'Cliente Confirmado', marginX + 14, currentY + 34);

    doc.fontSize(6.5).font('Helvetica-Bold').fillColor(textMuted).text('CORREO ELECTRONICO:', marginX + 14, currentY + 48);
    doc.fontSize(8).font('Helvetica').fillColor(textDark).text(sanitizeText(reservation.email) || 'N/A', marginX + 14, currentY + 56);

    doc.fontSize(6.5).font('Helvetica-Bold').fillColor(textMuted).text('TELEFONO / WHATSAPP:', marginX + 14, currentY + 69);
    doc.fontSize(8).font('Helvetica').fillColor(textDark).text(sanitizeText(reservation.phone) || 'No especificado', marginX + 14, currentY + 76);

    // --- Left Box 2: Payment Receipt Breakdown ---
    const payY = currentY + 96;
    doc.roundedRect(marginX, payY, leftWidth, 90, 6).fill(bgLight);
    doc.roundedRect(marginX, payY, leftWidth, 90, 6).stroke(borderColor);

    doc.fontSize(8.5).font('Helvetica-Bold').fillColor(primaryNavy).text('DESGLOSE Y RECIBO DE PAGO', marginX + 14, payY + 9);

    doc.fontSize(6.5).font('Helvetica-Bold').fillColor(textMuted).text('METODO DE PAGO:', marginX + 14, payY + 24);
    doc.fontSize(8).font('Helvetica').fillColor(textDark).text(sanitizeText(reservation.paymentMethod) || 'Stripe Direct (SSL 256-bit)', marginX + 14, payY + 33);

    doc.fontSize(6.5).font('Helvetica-Bold').fillColor(textMuted).text('MONTO TOTAL PAGADO:', marginX + 14, payY + 46);
    doc.fontSize(14).font('Helvetica-Bold').fillColor(accentOrange).text(`$${Number(reservation.amountPaid || 0).toFixed(2)} USD`, marginX + 14, payY + 55);

    if (reservation.balanceDue && reservation.balanceDue > 0) {
      doc.fontSize(7).font('Helvetica-Bold').fillColor('#b45309')
         .text(`Balance pendiente a pagar el dia del tour: $${Number(reservation.balanceDue).toFixed(2)} USD`, marginX + 14, payY + 74);
    } else {
      doc.fontSize(7).font('Helvetica-Bold').fillColor('#059669')
         .text('Transaccion 100% aprobada y confirmada en pasarela Stripe', marginX + 14, payY + 74);
    }

    // --- Right Box: Scannable QR Code Pass ---
    const qrBoxHeight = 186;
    doc.roundedRect(rightX, currentY, rightWidth, qrBoxHeight, 6).fill('#ffffff');
    doc.roundedRect(rightX, currentY, rightWidth, qrBoxHeight, 6).stroke(borderColor);

    doc.fontSize(7.5).font('Helvetica-Bold').fillColor(primaryNavy)
       .text(isFlight ? 'CODIGO QR DE EMBARQUE' : 'CODIGO QR DE ACCESO VIP', rightX + 6, currentY + 8, { align: 'center', width: rightWidth - 12 });

    const qrSize = 105;
    const qrX = rightX + (rightWidth - qrSize) / 2;
    doc.image(qrBuffer, qrX, currentY + 22, { width: qrSize, height: qrSize });

    doc.fontSize(6.5).font('Helvetica-Bold').fillColor(accentOrange)
       .text('ESCANEA CON TU CELULAR', rightX + 6, currentY + 132, { align: 'center', width: rightWidth - 12 });
    doc.fontSize(5.5).font('Helvetica').fillColor(textMuted)
       .text(isFlight 
         ? 'Escanea con tu camara para abrir y validar este boleto oficial en vivo.' 
         : 'Presenta este codigo al chofer o guia VIP al abordar el transporte.', 
         rightX + 6, currentY + 143, { align: 'center', width: rightWidth - 12 });

    doc.fontSize(5.5).font('Helvetica-Bold').fillColor(accentCyan)
       .text(`https://firetourdr.com/ticket/${pnr}`, rightX + 6, currentY + 168, { align: 'center', width: rightWidth - 12 });

    currentY += 194;

    // ========================================================
    // 5. SERVICES INCLUDED / WHAT IS INCLUDED (Excursion only)
    // ========================================================
    if (!isFlight) {
      doc.roundedRect(marginX, currentY, contentWidth, 68, 6).fill('#f0fdf4');
      doc.roundedRect(marginX, currentY, contentWidth, 68, 6).stroke('#86efac');

      doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#166534')
         .text('SERVICIOS Y BENEFICIOS INCLUIDOS EN SU RESERVA:', marginX + 14, currentY + 8);

      const leftIncX = marginX + 14;
      const rightIncX = marginX + 270;
      let incY = currentY + 22;

      // Extract included bullets from tour or sane defaults
      let incList = [];
      if (tour && Array.isArray(tour.included) && tour.included.length > 0) {
        incList = tour.included.slice(0, 4).map(item => sanitizeText(item));
      } else {
        incList = [
          'Transporte ida y vuelta climatizado desde su hotel o resort',
          'Guia turistico bilingue profesional y certificado',
          'Equipos completos de seguridad e instrucciones previas',
          'Entradas oficiales, accesos y actividades del itinerario'
        ];
      }

      // Render 2 columns
      if (incList[0]) doc.fontSize(7).font('Helvetica').fillColor('#14532d').text(`[OK] ${incList[0]}`, leftIncX, incY);
      if (incList[2]) doc.fontSize(7).font('Helvetica').fillColor('#14532d').text(`[OK] ${incList[2]}`, rightIncX, incY);
      incY += 14;
      if (incList[1]) doc.fontSize(7).font('Helvetica').fillColor('#14532d').text(`[OK] ${incList[1]}`, leftIncX, incY);
      if (incList[3]) doc.fontSize(7).font('Helvetica').fillColor('#14532d').text(`[OK] ${incList[3]}`, rightIncX, incY);
      incY += 14;
      doc.fontSize(6.5).font('Helvetica-Bold').fillColor('#15803d')
         .text('Asistencia VIP durante toda la actividad y seguro basico de excursionista incluido.', leftIncX, incY);

      currentY += 76;
    }

    // ========================================================
    // 6. INSTRUCTIONS & PREPARATION CARD (What to bring & do)
    // ========================================================
    const instrHeight = isFlight ? 72 : 84;
    doc.roundedRect(marginX, currentY, contentWidth, instrHeight, 6).fill('#fffbeb');
    doc.roundedRect(marginX, currentY, contentWidth, instrHeight, 6).stroke('#fde68a');

    doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#92400e')
       .text(isFlight ? 'INSTRUCCIONES IMPORTANTES PARA EL PASAJERO:' : 'GUIA DEL VIAJERO · QUE LLEVAR Y RECOMENDACIONES CLAVE:', marginX + 14, currentY + 8);

    if (isFlight) {
      doc.fontSize(6.8).font('Helvetica').fillColor('#78350f')
         .text('- Presentese en el mostrador de facturacion de la aerolinea con 3 horas de antelacion para vuelos internacionales.', marginX + 14, currentY + 20)
         .text('- Debe portar su pasaporte valido (con vigencia minima de 6 meses) o documento nacional de identidad requerido.', marginX + 14, currentY + 31)
         .text('- Muestre este documento o el codigo QR desde su celular para obtener su pase de abordar fisico o facturar equipaje.', marginX + 14, currentY + 42)
         .text('- El check-in online abre 24 horas antes de la salida en el portal oficial de la aerolinea con su codigo PNR.', marginX + 14, currentY + 53);
      currentY += 80;
    } else {
      doc.fontSize(6.8).font('Helvetica').fillColor('#78350f')
         .text('- 1. HORA Y RECOGIDA: Estar en el lobby principal 15 minutos antes de la hora indicada con este voucher digital o impreso.', marginX + 14, currentY + 20)
         .text('- 2. VESTIMENTA: Ropa comoda y fresca, traje de bano puesto, toalla de su hotel, calzado de agua o tenis cerrados.', marginX + 14, currentY + 31)
         .text('- 3. PROTECCION: Protector solar y repelente biodegradables, lentes de sol oscuros y gorra o sombrero.', marginX + 14, currentY + 42)
         .text('- 4. DINERO EN EFECTIVO: Recomendado para propinas opcionales a guias/chofer, fotos profesionales o souvenirs tipicos.', marginX + 14, currentY + 53)
         .text('- 5. SOPORTE 24/7: Para cambios de fecha o asistencia inmediata escribanos por WhatsApp al +1 (587) 225-7342.', marginX + 14, currentY + 64);
      currentY += 92;
    }

    // ========================================================
    // 7. OFFICIAL FOOTER
    // ========================================================
    doc.strokeColor(borderColor).lineWidth(0.8).moveTo(marginX, currentY).lineTo(pageWidth - marginX, currentY).stroke();

    doc.fontSize(7).font('Helvetica-Bold').fillColor(textDark)
       .text('FIRE TOUR DR · Operador Turistico Oficial en Republica Dominicana · Validez Garantizada', marginX, currentY + 6, { align: 'center', width: contentWidth });
    doc.fontSize(5.8).font('Helvetica').fillColor(textMuted)
       .text('Carretera Bavaro-Punta Cana, La Altagracia · Soporte WhatsApp 24/7: +1 (587) 225-7342 · Correo Oficial: booking.inf@firetourdr.com · www.firetourdr.com', marginX, currentY + 16, { align: 'center', width: contentWidth });

    doc.end();
  });
}

module.exports = {
  generateTicketPdfBuffer,
  sanitizeText
};
