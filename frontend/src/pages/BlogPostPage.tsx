import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Clock, Calendar, ArrowLeft, Tag, CheckCircle2, Lightbulb, Compass, Share2 } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogData';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace de la guía copiado al portapapeles!');
    }
  };

  return (
    <div className="min-h-screen bg-bgDark text-gray-200 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto space-y-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-cyan hover:underline font-bold">
            <ArrowLeft className="w-4 h-4" /> Volver a todas las Guías
          </Link>
          <button 
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan" /> Compartir
          </button>
        </div>

        {/* Header Content */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
            <span className="bg-secondary/15 text-secondary border border-secondary/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px]">
              {post.category}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan" /> {post.readTime}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {post.date}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-body">
            {post.excerpt}
          </p>

          {/* Author Badge */}
          <div className="pt-2 flex items-center gap-3 border-t border-white/10">
            <img 
              src={post.author.avatar} 
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover border border-cyan/40" 
            />
            <div>
              <p className="text-sm font-bold text-white">{post.author.name}</p>
              <p className="text-xs text-gray-400">{post.author.role}</p>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-premium max-h-[480px]">
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Article Body */}
        <div className="bg-surface/80 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-glass space-y-8 leading-relaxed text-gray-300 text-sm sm:text-base">
          
          {/* Introduction */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border-l-4 border-secondary text-gray-200 text-base sm:text-lg font-light leading-relaxed">
            {post.content.introduction}
          </div>

          {/* Table of Contents Box */}
          <div className="bg-black/40 border border-white/10 p-5 rounded-2xl space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan flex items-center gap-2">
              <Compass className="w-4 h-4" /> En esta guía aprenderás:
            </p>
            <ul className="space-y-1.5 text-xs sm:text-sm pl-2">
              {post.content.sections.map((section, idx) => (
                <li key={idx} className="text-gray-300">
                  <span className="text-secondary font-bold mr-1.5">›</span> {section.heading}
                </li>
              ))}
            </ul>
          </div>

          {/* Main Content Sections */}
          <div className="space-y-8">
            {post.content.sections.map((section, idx) => (
              <section key={idx} className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white border-b border-white/10 pb-2">
                  {section.heading}
                </h2>
                {section.body.map((p, pIdx) => (
                  <p key={pIdx} className="leading-relaxed">
                    {p}
                  </p>
                ))}

                {section.tip && (
                  <div className="mt-4 p-4 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-start gap-3 text-amber-200 text-xs sm:text-sm">
                    <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block mb-0.5">Consejo Local de Fire Tour:</strong>
                      {section.tip}
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Key Takeaways Card */}
          <div className="bg-black/50 border border-cyan/30 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold font-display text-white flex items-center gap-2 text-cyan">
              <CheckCircle2 className="w-5 h-5 text-cyan" /> Puntos Clave para Recordar
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {post.content.keyTakeaways.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-200">
                  <span className="text-cyan font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Conclusion */}
          <div className="pt-4 border-t border-white/10">
            <h3 className="text-xl font-bold font-display text-white mb-2">Conclusión</h3>
            <p className="text-gray-300 leading-relaxed">
              {post.content.conclusion}
            </p>
          </div>

          {/* AdSense In-Article Anchor Placeholder */}
          <div className="my-8 p-4 rounded-2xl bg-white/5 border border-dashed border-white/20 text-center">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-2">Espacio Informativo Patrocinado</span>
            <div className="min-h-[90px] flex items-center justify-center text-xs text-gray-400">
              Contenido respaldado por la Red de Viajes y Operadores de Punta Cana
            </div>
          </div>

          {/* Call to action: Book Tour */}
          {post.relatedTourId && (
            <div className="bg-gradient-to-r from-secondary/20 via-surface to-cyan/20 border border-secondary/40 rounded-2xl p-6 sm:p-8 text-center space-y-4">
              <h4 className="text-xl sm:text-2xl font-bold font-display text-white">
                ¿Listo para vivir esta aventura en persona?
              </h4>
              <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto">
                Reserva directamente con Fire Tour DR con recogida incluida en tu resort, guías certificados y cancelación flexible.
              </p>
              <div>
                <Link
                  to={`/excursion/${post.relatedTourId}`}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-secondary text-white font-bold font-display text-sm hover:scale-105 transition-all shadow-glow"
                >
                  Ver Detalles y Reservar Tour
                </Link>
              </div>
            </div>
          )}

        </div>

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link to="/blog" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
            ← Ver todas las Guías de Turismo de Fire Tour DR
          </Link>
        </div>

      </article>
    </div>
  );
}
