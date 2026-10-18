import React, { useState } from 'react';
import { BookOpen, Clock, Calendar, ArrowRight, Compass, Search, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogData';

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Guías de Destino', 'Aventura y Adrenalina', 'Transporte y Logística', 'Consejos de Viaje', 'Playas y Naturaleza'];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = BLOG_POSTS[0];

  return (
    <div className="min-h-screen bg-bgDark text-gray-200 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-xs font-bold uppercase tracking-widest">
            <BookOpen className="w-4 h-4" /> Centro de Guías & Turismo
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display text-white tracking-tight">
            Guías de Viaje & Consejos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-orange-400 to-amber-300">Punta Cana</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-400">
            Artículos informativos, consejos locales de seguridad y recomendaciones de expertos para planificar tus vacaciones en República Dominicana.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-surface/80 border border-white/10 rounded-2xl p-4 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-glass">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar guías o temas (ej. Saona, Buggies, Clima)..."
              className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan transition"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? 'bg-secondary text-white shadow-glow' 
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Hero Article */}
        {selectedCategory === 'Todos' && !searchTerm && featuredPost && (
          <div className="bg-surface border border-white/10 rounded-3xl overflow-hidden shadow-premium hover:border-secondary/40 transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 sm:h-80 lg:h-auto overflow-hidden">
                <img 
                  src={featuredPost.coverImage} 
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-secondary text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                    Artículo Destacado
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-10 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="text-cyan font-bold flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" /> {featuredPost.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {featuredPost.readTime}
                    </span>
                    <span className="hidden sm:flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {featuredPost.date}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white leading-tight hover:text-secondary transition-colors">
                    <Link to={`/blog/${featuredPost.slug}`}>
                      {featuredPost.title}
                    </Link>
                  </h2>

                  <p className="text-sm text-gray-300 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={featuredPost.author.avatar} 
                      alt={featuredPost.author.name}
                      className="w-10 h-10 rounded-full object-cover border border-white/20" 
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{featuredPost.author.name}</p>
                      <p className="text-[11px] text-gray-400">{featuredPost.author.role}</p>
                    </div>
                  </div>

                  <Link 
                    to={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-secondary hover:text-orange-400 transition"
                  >
                    Leer Guía Completa <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-secondary" /> Todas las Guías & Artículos ({filteredPosts.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <article 
                key={post.slug}
                className="bg-surface/90 border border-white/10 rounded-2xl overflow-hidden hover:border-secondary/40 transition-all duration-300 flex flex-col justify-between group shadow-glass"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.coverImage} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-cyan text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/10">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-3 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-secondary" /> {post.readTime}
                      </span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>

                    <h4 className="font-bold font-display text-white text-base leading-snug group-hover:text-secondary transition-colors line-clamp-2">
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h4>

                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-white/5 flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name} 
                      className="w-7 h-7 rounded-full object-cover border border-white/10"
                    />
                    <span className="text-[11px] text-gray-300 font-medium">{post.author.name}</span>
                  </div>

                  <Link 
                    to={`/blog/${post.slug}`}
                    className="text-xs font-bold text-cyan hover:underline inline-flex items-center gap-1"
                  >
                    Leer <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16 bg-surface/40 border border-white/5 rounded-2xl">
              <p className="text-gray-400 text-sm">No encontramos artículos que coincidan con tu búsqueda.</p>
              <button 
                onClick={() => { setSearchTerm(''); setSelectedCategory('Todos'); }}
                className="mt-3 text-xs font-bold text-cyan underline"
              >
                Restablecer filtros
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
