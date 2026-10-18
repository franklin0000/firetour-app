import React from 'react';
import { FileCheck, ShieldAlert, Clock, RefreshCw, AlertTriangle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  const lastUpdated = "15 de Octubre de 2024";

  return (
    <div className="min-h-screen bg-bgDark text-gray-200 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-xs font-bold uppercase tracking-widest mb-4">
            <FileCheck className="w-4 h-4" /> Términos del Servicio
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight mb-4">
            Términos y Condiciones de Uso
          </h1>
          <p className="text-sm text-gray-400">
            Última actualización: <span className="text-white font-medium">{lastUpdated}</span> | Fire Tour DR
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-premium space-y-8 leading-relaxed text-sm sm:text-base text-gray-300">
          
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-secondary" /> 1. Aceptación de los Términos
            </h2>
            <p>
              Al acceder, navegar o realizar una reserva a través de <strong className="text-white">Fire Tour DR</strong> (<span className="text-cyan font-mono">https://www.firetourdr.com</span>), usted acepta expresamente quedar vinculado por los presentes Términos y Condiciones, así como por nuestra Política de Privacidad. Si no está de acuerdo con alguna disposición de estos términos, le solicitamos abstenerse de utilizar nuestra plataforma y servicios.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-secondary" /> 2. Reservas y Emisión de Tickets
            </h2>
            <p>
              Toda solicitud de excursión o traslado realizada en nuestro sitio web genera un comprobante o ticket digital con código único de reserva. La confirmación definitiva está sujeta a la disponibilidad del tour y a la correcta recepción del pago correspondiente.
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>El cliente es responsable de indicar con exactitud el nombre del hotel, resort o villa de alojamiento para coordinar el horario de recogida (pick-up).</li>
              <li>Los horarios de recogida se reconfirmarán vía WhatsApp o correo electrónico antes de la fecha pautada.</li>
            </ul>
          </section>

          {/* Cancellation Policy */}
          <section className="space-y-4 bg-black/40 border border-white/10 p-5 sm:p-6 rounded-2xl">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white flex items-center gap-2 text-cyan">
              <RefreshCw className="w-5 h-5 text-cyan" /> 3. Política de Cancelación y Reembolsos
            </h2>
            <p>
              En Fire Tour DR ofrecemos una política flexible y transparente de cancelación para su tranquilidad durante sus vacaciones:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong className="text-white">Cancelación con más de 24 horas de antelación:</strong> Reembolso del 100% del importe pagado o reprogramación sin costo alguno de la fecha de la excursión.</li>
              <li><strong className="text-white">Cancelación con menos de 24 horas o No-Show (no presentación):</strong> No aplica reembolso directo por causas imputables al pasajero debido a los costos logísticos y de transporte ya comprometidos con los proveedores locales.</li>
              <li><strong className="text-white">Cancelación por Condiciones Meteorológicas Adversas:</strong> Si la Armada Dominicana o las autoridades marítimas restringen el despacho de embarcaciones (por tormentas, oleaje o mal tiempo), el cliente podrá elegir entre la reprogramación sin costo o el reembolso total del 100% de la excursión.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-secondary" /> 4. Precios, Divisas y Pagos
            </h2>
            <p>
              Los precios de las excursiones se presentan de forma clara en dólares estadounidenses (USD) e incluyen los impuestos aplicables. Los pagos se procesan de manera segura a través de pasarelas certificadas internacionalmente como Stripe, garantizando el cifrado de extremo a extremo.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-secondary" /> 5. Seguridad, Salud y Responsabilidad del Pasajero
            </h2>
            <p>
              Ciertas excursiones de aventura (como Buggies 4x4, buceo o tirolesas) requieren un estado físico adecuado. Es deber del cliente informar con anterioridad si presenta condiciones médicas preexistentes, embarazo o movilidad reducida. Todos nuestros operadores asociados cuentan con pólizas de seguro de responsabilidad civil y cumplen con los protocolos marítimos y terrestres de la República Dominicana.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-secondary" /> 6. Legislación Aplicable y Jurisdicción
            </h2>
            <p>
              Estos Términos y Condiciones se rigen e interpretan de conformidad con las leyes vigentes de la República Dominicana. Cualquier litigio o controversia que surja en relación con los presentes términos será sometido a la jurisdicción de los tribunales competentes de la provincia La Altagracia, República Dominicana.
            </p>
          </section>

          {/* Contact details */}
          <section className="pt-6 border-t border-white/10 space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-cyan" /> 7. Dudas o Reclamaciones
            </h2>
            <p>
              Para cualquier consulta sobre nuestras condiciones o asistencia con su reserva:
            </p>
            <div className="bg-white/5 p-4 rounded-xl space-y-1 text-sm">
              <p><strong className="text-white">Correo Electrónico:</strong> <a href="mailto:booking.inf@firetourdr.com" className="text-cyan underline">booking.inf@firetourdr.com</a></p>
              <p><strong className="text-white">WhatsApp de Atención al Cliente:</strong> +1 (587) 225-7342</p>
              <p><strong className="text-white">Sede Operativa:</strong> Punta Cana, Bávaro, La Altagracia, República Dominicana</p>
            </div>
          </section>

        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link to="/" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
            ← Volver al Catálogo Principal de Excursiones
          </Link>
        </div>
      </div>
    </div>
  );
}
