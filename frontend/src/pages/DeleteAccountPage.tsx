import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Mail, ShieldCheck, CheckCircle2, AlertTriangle, FileText, ArrowLeft } from 'lucide-react';

const MAILTO_HREF =
  'mailto:booking.inf@firetourdr.com?subject=Eliminar%20mi%20cuenta%20%E2%80%94%20Fire%20Tour%20DR&body=Hola%20equipo%20de%20Fire%20Tour%20DR%2C%0A%0ASolicito%20la%20eliminaci%C3%B3n%20de%20mi%20cuenta%20asociada%20a%20este%20correo%20electr%C3%B3nico.%0A%0ANombre%20completo%3A%20%0A';

export default function DeleteAccountPage() {
  return (
    <div className="min-h-screen bg-bgDark text-gray-200 pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-xs font-bold uppercase tracking-widest mb-4">
            <Trash2 className="w-4 h-4" /> Fire Tour DR · com.firetourdr.app
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight mb-4">
            Eliminación de Cuenta / Account Deletion
          </h1>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Página oficial de <strong className="text-white">Fire Tour DR</strong> (<span className="text-cyan font-mono">firetourdr.com</span> / app Android <span className="text-cyan font-mono">com.firetourdr.app</span>) para solicitar la eliminación definitiva de tu cuenta y tus datos personales.
          </p>

          {/* Language jump pills */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <a
              href="#espanol"
              className="px-4 py-2 rounded-full bg-secondary/15 border border-secondary/40 text-secondary hover:bg-secondary hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Español
            </a>
            <a
              href="#english"
              className="px-4 py-2 rounded-full bg-cyan/15 border border-cyan/40 text-cyan hover:bg-cyan hover:text-black text-xs font-bold uppercase tracking-wider transition-colors"
            >
              English
            </a>
          </div>
        </div>

        {/* SPANISH SECTION */}
        <article
          id="espanol"
          className="bg-surface/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-premium space-y-8 leading-relaxed text-sm sm:text-base text-gray-300 mb-10 scroll-mt-28"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-secondary">Versión en Español</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
                Solicitud Oficial de Eliminación de Cuenta — Fire Tour DR
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
              ES
            </span>
          </div>

          <p>
            Esta es la <strong className="text-white">página oficial de Fire Tour DR</strong> para que cualquier usuario de nuestro portal web (<span className="text-cyan font-mono">https://firetourdr.com</span>) o de nuestra aplicación móvil (<span className="text-cyan font-mono">com.firetourdr.app</span>) pueda solicitar la eliminación de su cuenta y los datos asociados.
          </p>

          {/* Steps ES */}
          <section className="space-y-4 bg-black/40 border border-secondary/25 rounded-2xl p-5 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-secondary" /> Pasos para solicitar la eliminación de tu cuenta
            </h3>
            <ol className="list-decimal list-inside space-y-2.5 text-gray-200 pl-1">
              <li>
                Envía un correo electrónico <strong className="text-white">desde la misma dirección de correo</strong> vinculada a tu cuenta de Fire Tour DR (o tu cuenta de Google utilizada para iniciar sesión).
              </li>
              <li>
                Dirige el correo a:{' '}
                <a href={MAILTO_HREF} className="text-cyan underline font-semibold break-all">
                  booking.inf@firetourdr.com
                </a>
              </li>
              <li>
                Coloca como asunto exacto:{' '}
                <strong className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">
                  Eliminar mi cuenta — Fire Tour DR
                </strong>
              </li>
              <li>
                Indica en el mensaje tu <strong className="text-white">nombre completo</strong> para verificar tu identidad.
              </li>
              <li>
                Nuestro equipo confirmará la recepción de tu solicitud por correo electrónico y procederá a eliminar tu cuenta y los datos aplicables.
              </li>
            </ol>

            <div className="pt-2">
              <a
                href={MAILTO_HREF}
                className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-orange-500 text-white font-black uppercase tracking-wider font-display px-6 py-3.5 rounded-2xl text-xs shadow-glow transition-all"
              >
                <Mail className="w-4 h-4" /> Enviar solicitud a booking.inf@firetourdr.com
              </a>
            </div>
          </section>

          {/* Data Deleted ES */}
          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Qué datos se eliminan
            </h3>
            <p>Al completarse la solicitud, eliminaremos de nuestra base de datos activa los siguientes datos asociados a tu cuenta:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong className="text-white">Nombre completo</strong> registrado en tu perfil.</li>
              <li><strong className="text-white">Correo electrónico</strong> y credenciales o vínculo de acceso con Google.</li>
              <li><strong className="text-white">Reservas vinculadas</strong> a tu cuenta en el historial de usuario.</li>
              <li><strong className="text-white">Boletos digitales (vouchers y códigos QR)</strong> asociados a tu perfil.</li>
            </ul>
          </section>

          {/* Data Retained ES */}
          <section className="space-y-3 bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> Qué datos se conservan y por cuánto tiempo
            </h3>
            <p>
              Únicamente se conservan los <strong className="text-white">registros de pago y facturación que exige la ley</strong> (por ejemplo, comprobantes de transacciones procesadas mediante Stripe y obligaciones fiscales o contables aplicables). Estos registros no se utilizan con fines comerciales ni publicitarios.
            </p>
            <p className="text-xs sm:text-sm text-amber-200/90 bg-amber-500/10 border border-amber-500/25 rounded-xl px-4 py-3">
              <strong>Plazo de conservación legal:</strong> pendiente de confirmación por el dueño de Fire Tour DR (se aplicará únicamente el plazo mínimo exigido por la legislación fiscal y contable vigente).
            </p>
          </section>
        </article>

        {/* ENGLISH SECTION */}
        <article
          id="english"
          className="bg-surface/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-premium space-y-8 leading-relaxed text-sm sm:text-base text-gray-300 scroll-mt-28"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-cyan">English Version</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
                Official Account Deletion Request — Fire Tour DR
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
              EN
            </span>
          </div>

          <p>
            This is the <strong className="text-white">official Fire Tour DR account deletion page</strong> for users of our website (<span className="text-cyan font-mono">https://firetourdr.com</span>) and Android app (<span className="text-cyan font-mono">com.firetourdr.app</span>) to request permanent deletion of their account and associated personal data.
          </p>

          {/* Steps EN */}
          <section className="space-y-4 bg-black/40 border border-cyan/25 rounded-2xl p-5 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-cyan" /> How to Request Account Deletion
            </h3>
            <ol className="list-decimal list-inside space-y-2.5 text-gray-200 pl-1">
              <li>
                Send an email <strong className="text-white">from the same email address</strong> linked to your Fire Tour DR account (or the Google account you used to sign in).
              </li>
              <li>
                Send the request to:{' '}
                <a href={MAILTO_HREF} className="text-cyan underline font-semibold break-all">
                  booking.inf@firetourdr.com
                </a>
              </li>
              <li>
                Use the subject line:{' '}
                <strong className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">
                  Eliminar mi cuenta — Fire Tour DR
                </strong>
              </li>
              <li>
                Include your <strong className="text-white">full name</strong> in the message so our team can verify your identity.
              </li>
              <li>
                Our support team will confirm your request via email and proceed to delete your account and eligible data.
              </li>
            </ol>

            <div className="pt-2">
              <a
                href={MAILTO_HREF}
                className="inline-flex items-center justify-center gap-2 bg-cyan hover:bg-cyan-400 text-black font-black uppercase tracking-wider font-display px-6 py-3.5 rounded-2xl text-xs transition-all"
              >
                <Mail className="w-4 h-4" /> Email booking.inf@firetourdr.com
              </a>
            </div>
          </section>

          {/* Data Deleted EN */}
          <section className="space-y-3">
            <h3 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Data That Will Be Deleted
            </h3>
            <p>Once your request is verified and processed, we permanently delete the following account data:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong className="text-white">Full name</strong> stored on your profile.</li>
              <li><strong className="text-white">Email address</strong> and sign-in credentials / Google account link.</li>
              <li><strong className="text-white">Linked bookings / reservations</strong> in your user account history.</li>
              <li><strong className="text-white">Digital tickets (vouchers & QR passes)</strong> associated with your account.</li>
            </ul>
          </section>

          {/* Data Retained EN */}
          <section className="space-y-3 bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> Data Retained & Retention Period
            </h3>
            <p>
              We retain <strong className="text-white">only payment and billing records required by law</strong> (such as transaction receipts processed through Stripe and mandatory tax or accounting records). These records are never used for marketing or advertising.
            </p>
            <p className="text-xs sm:text-sm text-amber-200/90 bg-amber-500/10 border border-amber-500/25 rounded-xl px-4 py-3">
              <strong>Statutory retention period:</strong> pending confirmation by the owner of Fire Tour DR (only the minimum period required under applicable tax and accounting laws will apply).
            </p>
          </section>

          {/* Related links */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
            <Link to="/politica-de-privacidad" className="inline-flex items-center gap-1.5 text-cyan hover:underline font-semibold">
              <ShieldCheck className="w-4 h-4" /> Política de Privacidad / Privacy Policy
            </Link>
            <Link to="/reservations" className="inline-flex items-center gap-1.5 text-gray-300 hover:text-white font-semibold">
              <FileText className="w-4 h-4 text-secondary" /> Mis Reservas / My Bookings
            </Link>
          </div>
        </article>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver a Fire Tour DR
          </Link>
        </div>
      </div>
    </div>
  );
}
