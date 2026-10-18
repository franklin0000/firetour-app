import React from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle2, Mail, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicyPage() {
  const lastUpdated = "15 de Octubre de 2024";

  return (
    <div className="min-h-screen bg-bgDark text-gray-200 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-xs font-bold uppercase tracking-widest mb-4">
            <Shield className="w-4 h-4" /> Legal y Transparencia
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight mb-4">
            Política de Privacidad y Cookies
          </h1>
          <p className="text-sm text-gray-400">
            Última actualización: <span className="text-white font-medium">{lastUpdated}</span> | Fire Tour DR
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-premium space-y-8 leading-relaxed text-sm sm:text-base text-gray-300">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-secondary" /> 1. Introducción y Compromiso
            </h2>
            <p>
              En <strong className="text-white">Fire Tour DR</strong> (operado como portal digital de reservaciones turísticas en Punta Cana, República Dominicana, accesible a través de <span className="text-cyan font-mono">https://www.firetourdr.com</span>), valoramos profundamente la privacidad de nuestros usuarios y clientes. Esta Política de Privacidad describe de manera detallada y transparente cómo recopilamos, utilizamos, almacenamos y protegemos la información personal y los datos de navegación que usted nos proporciona al interactuar con nuestro sitio web y servicios de excursiones.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-secondary" /> 2. Información que Recopilamos
            </h2>
            <p>Recopilamos información personal únicamente cuando es estrictamente necesaria para la prestación de nuestros servicios:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong className="text-white">Datos de Reserva:</strong> Nombre completo, dirección de correo electrónico, número de teléfono/WhatsApp, hotel de hospedaje para coordinar la recogida, fecha de la excursión y número de participantes.</li>
              <li><strong className="text-white">Datos de Pago:</strong> Las transacciones con tarjeta de crédito o débito se procesan de forma cifrada a través de pasarelas de pago seguras y certificadas PCI-DSS como <strong className="text-white">Stripe</strong>. Fire Tour DR nunca almacena los números completos de sus tarjetas de crédito ni códigos CVV en sus servidores.</li>
              <li><strong className="text-white">Datos Técnicos y de Registro:</strong> Dirección IP, tipo de navegador, proveedor de servicios de Internet (ISP), páginas de referencia/salida, sistema operativo, fecha/hora y métricas de interacción analítica.</li>
            </ul>
          </section>

          {/* Section 3 - Google AdSense & Third-party cookies (MANDATORY FOR ADSENSE COMPLIANCE) */}
          <section className="space-y-4 bg-black/40 border border-secondary/20 p-5 sm:p-6 rounded-2xl">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white flex items-center gap-2 text-secondary">
              <FileText className="w-5 h-5 text-secondary" /> 3. Proveedores Publicitarios y Google AdSense
            </h2>
            <p>
              Este sitio web utiliza o puede utilizar servicios publicitarios de terceros, incluyendo <strong className="text-white">Google AdSense</strong>, para publicar anuncios personalizados o no personalizados cuando visita nuestro portal:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <strong className="text-white">Uso de Cookies de Terceros:</strong> Proveedores terceros, incluido Google, utilizan cookies para publicar anuncios basados en las visitas anteriores del usuario a este sitio web o a otros sitios de Internet.
              </li>
              <li>
                <strong className="text-white">Cookie DART de Google:</strong> El uso de cookies publicitarias permite a Google y a sus socios mostrar anuncios a los usuarios en función de sus visitas a sus sitios y/o a otros sitios web en Internet.
              </li>
              <li>
                <strong className="text-white">Inhabilitación de la publicidad personalizada:</strong> Los usuarios pueden optar por no recibir publicidad personalizada visitando la página de{' '}
                <a 
                  href="https://www.google.com/settings/ads" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-cyan underline hover:text-cyan/80 inline-flex items-center gap-1"
                >
                  Configuración de Anuncios de Google <ExternalLink className="w-3.5 h-3.5" />
                </a>. Alternativamente, puede inhabilitar el uso de cookies de proveedores externos para la publicidad personalizada dirigiéndose a{' '}
                <a 
                  href="https://www.aboutads.info/choices/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-cyan underline hover:text-cyan/80 inline-flex items-center gap-1"
                >
                  www.aboutads.info <ExternalLink className="w-3.5 h-3.5" />
                </a>.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-secondary" /> 4. Finalidad del Tratamiento de Datos
            </h2>
            <p>Utilizamos la información recopilada para:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Confirmar y emitir sus tickets y vouchers digitales de excursiones.</li>
              <li>Coordinar el transporte y la logística de recogida en su resort o villa.</li>
              <li>Comunicar actualizaciones de itinerario, condiciones meteorológicas o cambios de horario.</li>
              <li>Atender consultas y brindar soporte al cliente vía WhatsApp o correo electrónico.</li>
              <li>Cumplir con las normativas legales, fiscales y de seguridad marítima vigentes en la República Dominicana.</li>
              <li>Mejorar la experiencia de usuario y optimizar la navegación en nuestro sitio web.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-secondary" /> 5. Protección y Seguridad de los Datos
            </h2>
            <p>
              Implementamos protocolos de seguridad estándar en la industria digital, tales como cifrado SSL/TLS de 256 bits en todo el tráfico de datos, firewalls perimetrales y almacenamiento seguro. Sus datos nunca son vendidos, alquilados ni transferidos a empresas ajenas con fines comerciales no vinculados a su excursión.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-secondary" /> 6. Derechos del Usuario (ARCO y GDPR)
            </h2>
            <p>
              Usted tiene derecho en todo momento a acceder, rectificar, cancelar u oponerse al tratamiento de sus datos personales. Si desea solicitar una copia de los datos que tenemos sobre usted o pedir su eliminación definitiva de nuestros registros, puede comunicarse directamente con nuestro oficial de privacidad en <strong className="text-white">booking.inf@firetourdr.com</strong>.
            </p>
          </section>

          {/* Section 7 - Contact */}
          <section className="pt-6 border-t border-white/10 space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-cyan" /> 7. Contacto Oficial
            </h2>
            <p>Si tiene cualquier duda respecto a esta política de privacidad o el manejo de sus datos, contáctenos:</p>
            <div className="bg-white/5 p-4 rounded-xl space-y-1 text-sm">
              <p><strong className="text-white">Entidad:</strong> Fire Tour DR</p>
              <p><strong className="text-white">Ubicación:</strong> Punta Cana, Bávaro, La Altagracia, República Dominicana</p>
              <p><strong className="text-white">Correo Electrónico:</strong> <a href="mailto:booking.inf@firetourdr.com" className="text-cyan underline">booking.inf@firetourdr.com</a></p>
              <p><strong className="text-white">WhatsApp de Atención:</strong> +1 (587) 225-7342</p>
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
