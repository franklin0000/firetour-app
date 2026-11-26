const fs = require('fs');
const path = require('path');

async function run() {
  console.log('--- Starting Fire Tour DR Pre-rendering Engine ---');
  
  const distDir = path.resolve(__dirname, '../dist');
  const distServerDir = path.resolve(__dirname, '../dist-server');
  const indexHtmlPath = path.join(distDir, 'index.html');
  
  if (!fs.existsSync(indexHtmlPath)) {
    throw new Error('dist/index.html not found. Please run vite build first.');
  }
  const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');

  // Load SSR bundle
  const serverEntryPath = path.join(distServerDir, 'entry-server.js');
  if (!fs.existsSync(serverEntryPath)) {
    throw new Error('dist-server/entry-server.js not found. Please run vite build --ssr first.');
  }
  const { render, BLOG_POSTS, RESORTS_DATA } = await import('file://' + serverEntryPath.replace(/\\/g, '/'));

  // Load tours
  const toursDataPath = path.resolve(__dirname, '../public/data/tours.json');
  const tours = JSON.parse(fs.readFileSync(toursDataPath, 'utf8')).tours || [];
  console.log(`Loaded ${tours.length} tours, ${BLOG_POSTS.length} blog posts, ${RESORTS_DATA.length} resorts.`);

  // Load sitemap URLs
  const sitemapPath = path.resolve(__dirname, '../public/sitemap.xml');
  const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');
  const sitemapUrls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  console.log(`Found ${sitemapUrls.length} URLs in sitemap.xml to pre-render.`);

  let renderedCount = 0;

  for (const fullUrl of sitemapUrls) {
    const urlObj = new URL(fullUrl);
    const pathname = urlObj.pathname.replace(/\/$/, '') || '/';
    
    let title = 'Fire Tour DR - Excursiones Premium en Punta Cana | Mejores Tours y Traslados';
    let description = 'Reserva las mejores excursiones en Punta Cana con Fire Tour DR: Isla Saona All Inclusive VIP ($75 USD por persona), Buggy Adventure ($120 USD por 2 personas), Parasailing ($120 USD por 2 personas) y Traslados Privados Aeropuerto PUJ (cotización en WhatsApp). Confirmación inmediata.';
    let initialData = {};
    let renderContext = {};

    if (pathname === '/' || pathname === '/excursiones') {
      title = pathname === '/' 
        ? 'Fire Tour DR - Excursiones Premium en Punta Cana | Mejores Tours y Traslados'
        : 'Catálogo de Excursiones en Punta Cana 2026 | Fire Tour DR';
      description = 'Reserva las mejores excursiones en Punta Cana con Fire Tour DR: Isla Saona All Inclusive VIP ($75 USD por persona), Buggy Adventure ($120 USD por 2 personas), Parasailing ($120 USD por 2 personas) y Traslados Privados Aeropuerto PUJ (cotización en WhatsApp). Confirmación inmediata.';
      renderContext = { tours: tours.slice(0, 12) };
      initialData = { tours: tours.slice(0, 12) };
    } else if (pathname.startsWith('/excursion/')) {
      const tourId = pathname.replace('/excursion/', '');
      const tour = tours.find(t => String(t.id) === String(tourId));
      if (tour) {
        title = `${tour.name} | Fire Tour DR Punta Cana`;
        if (tourId === '1') {
          description = 'Reserva Isla Saona All Inclusive VIP en Punta Cana ($75 USD por persona). Catamarán de fiesta, lancha rápida, piscina natural con estrellas de mar y buffet en playa privada.';
        } else if (tourId === '2') {
          description = 'Aventura Buggy Adventure 4x4 en Macao ($120 USD por 2 personas). Cenote subterráneo, playa Macao virgen y degustación de café y cacao orgánico dominicano.';
        } else if (tourId === '3') {
          description = 'Vuelo en Parasailing en Punta Cana ($120 USD por 2 personas) sobre la espectacular costa de Playa Bávaro. Vistas aéreas panorámicas y recogida incluida.';
        } else if (tourId === '4') {
          description = 'Traslado Privado Aeropuerto Punta Cana (PUJ) VIP ida y vuelta. Vehículos modernos con aire acondicionado y chofer privado. Cotización personalizada en WhatsApp.';
        } else {
          const cleanDesc = (tour.description || tour.shortDescription || '').replace(/["\r\n]+/g, ' ').trim();
          const snippet = cleanDesc.length > 130 ? cleanDesc.slice(0, 130) + '...' : cleanDesc;
          description = `Reserva ${tour.name} en Punta Cana con Fire Tour DR. ${snippet} Desde $${tour.price} USD. Confirmación inmediata y pago seguro.`;
        }
        renderContext = { tour };
        initialData = { tour };
      }
    } else if (pathname === '/blog') {
      title = 'Guías de Viaje, Consejos y Destinos en Punta Cana | Blog Fire Tour DR';
      description = 'Descubre las mejores guías turísticas de Punta Cana y República Dominicana: qué hacer, mejores playas, consejos de seguridad, clima y recomendaciones de excursiones.';
    } else if (pathname.startsWith('/blog/')) {
      const slug = pathname.replace('/blog/', '');
      const post = BLOG_POSTS.find(p => p.slug === slug);
      if (post) {
        title = `${post.title} | Blog Fire Tour DR`;
        description = post.excerpt;
      }
    } else if (pathname.startsWith('/hoteles/')) {
      const slug = pathname.replace('/hoteles/', '');
      const resort = RESORTS_DATA.find(r => r.slug === slug);
      if (resort) {
        title = `Excursiones con Recogida en ${resort.name} | Fire Tour DR`;
        description = `Reserva excursiones y actividades con recogida directa en el lobby de ${resort.name}, Punta Cana. Isla Saona ($75 USD por persona), Buggy Adventure ($120 USD por 2 personas) y Parasailing.`;
      }
    } else if (pathname.startsWith('/excursiones-desde/')) {
      const slug = pathname.replace('/excursiones-desde/', '');
      const resort = RESORTS_DATA.find(r => r.slug === slug);
      if (resort) {
        title = `Tours y Excursiones desde ${resort.name} Punta Cana | Fire Tour DR`;
        description = `Las mejores excursiones desde ${resort.name} en Punta Cana con transporte incluido ida y vuelta. Isla Saona, Buggies Macao y actividades con confirmación inmediata.`;
      }
    } else if (pathname === '/punta-cana') {
      title = 'Guía Oficial de Punta Cana: Playas, Zonas y Consejos | Fire Tour DR';
      description = 'Conoce todo sobre Punta Cana: las mejores playas de Bávaro, zonas turísticas, clima, vida nocturna y las mejores excursiones con Fire Tour DR.';
    } else if (pathname === '/republica-dominicana') {
      title = 'Guía Turística de República Dominicana: Destinos y Consejos | Fire Tour DR';
      description = 'Descubre República Dominicana: Punta Cana, Samaná, Barahona, Santo Domingo colonial y las excursiones más emblemáticas del Caribe con Fire Tour DR.';
    } else if (pathname === '/reviews') {
      title = 'Reseñas y Opiniones de Clientes | Fire Tour DR Punta Cana';
      description = 'Lee las opiniones y testimonios reales de viajeros que reservaron excursiones en Punta Cana con Fire Tour DR. Calificación 4.9/5 estrellas.';
    } else if (pathname === '/vender-tours') {
      title = 'Proveedores Turísticos: Vender Tours y Excursiones | Fire Tour DR';
      description = 'Únete a la red de operadores de Fire Tour DR. Publica tus tours y actividades en Punta Cana y conecta con miles de viajeros internacionales.';
    } else if (pathname === '/sobre-nosotros') {
      title = 'Sobre Nosotros: Quiénes Somos | Fire Tour DR Punta Cana';
      description = 'Conoce al equipo de Fire Tour DR. Operador turístico local líder en Punta Cana, especializado en excursiones seguras, atención 24/7 y mejores precios.';
    } else if (pathname === '/contacto') {
      title = 'Contacto y Soporte 24/7 por WhatsApp | Fire Tour DR';
      description = 'Contáctanos por WhatsApp (+1 587-225-7342) o email para cotizaciones de traslados, preguntas sobre tours y atención personalizada en Punta Cana.';
    } else if (pathname === '/politica-de-privacidad') {
      title = 'Política de Privacidad y Cookies | Fire Tour DR';
      description = 'Política de privacidad y protección de datos personales de Fire Tour DR. Conoce cómo protegemos tu información en reservas online.';
    } else if (pathname === '/eliminar-cuenta') {
      title = 'Eliminación de Cuenta / Account Deletion | Fire Tour DR';
      description = 'Página oficial de Fire Tour DR (com.firetourdr.app) para solicitar la eliminación de tu cuenta y datos personales en español e inglés.';
    } else if (pathname === '/terminos-y-condiciones') {
      title = 'Términos y Condiciones de Reserva | Fire Tour DR';
      description = 'Términos y condiciones, políticas de cancelación flexible y garantía de servicio de Fire Tour DR en excursiones y traslados en Punta Cana.';
    } else if (pathname === '/checkout') {
      title = 'Checkout Seguro | Fire Tour DR';
      description = 'Finaliza tu reserva de excursiones en Punta Cana con total seguridad a través de Stripe y confirmación digital inmediata.';
    }

    // Render the React app content
    let appHtml = '';
    try {
      appHtml = render(pathname, renderContext);
    } catch (renderErr) {
      console.warn(`Render warning for ${pathname}:`, renderErr.message);
    }

    // Self-referencing canonical
    const canonicalUrl = `https://www.firetourdr.com${pathname === '/' ? '/' : pathname}`;

    // Assemble final HTML
    let html = baseHtml;

    // Replace Title
    html = html.replace(/<title>.*?<\/title>/s, `<title>${title}</title>`);

    // Replace Meta Description
    html = html.replace(/<meta name="description" content=".*?" \/>/s, `<meta name="description" content="${description}" />`);

    // Replace Canonical Link (self-referencing!)
    html = html.replace(/<link rel="canonical" href=".*?" \/>/s, `<link rel="canonical" href="${canonicalUrl}" />`);

    // Update OpenGraph and Twitter tags
    html = html.replace(/<meta property="og:title" content=".*?" \/>/s, `<meta property="og:title" content="${title}" />`);
    html = html.replace(/<meta property="og:description" content=".*?" \/>/s, `<meta property="og:description" content="${description}" />`);
    html = html.replace(/<meta property="og:url" content=".*?" \/>/s, `<meta property="og:url" content="${canonicalUrl}" />`);
    html = html.replace(/<meta name="twitter:title" content=".*?" \/>/s, `<meta name="twitter:title" content="${title}" />`);
    html = html.replace(/<meta name="twitter:description" content=".*?" \/>/s, `<meta name="twitter:description" content="${description}" />`);
    html = html.replace(/<meta name="twitter:url" content=".*?" \/>/s, `<meta name="twitter:url" content="${canonicalUrl}" />`);

    // Inject route-specific JSON-LD Structured Data (eliminates Schema Mismatch in GSC)
    if (pathname.startsWith('/blog/')) {
      const slug = pathname.replace('/blog/', '');
      const post = BLOG_POSTS.find(p => p.slug === slug);
      if (post) {
        const blogImg = post.coverImage.startsWith('http')
          ? post.coverImage
          : `https://www.firetourdr.com${post.coverImage}`;

        // Update og:type & og:image / twitter:image for article
        html = html.replace(/<meta property="og:type" content=".*?" \/>/s, `<meta property="og:type" content="article" />`);
        html = html.replace(/<meta property="og:image" content=".*?" \/>/s, `<meta property="og:image" content="${blogImg}" />`);
        html = html.replace(/<meta name="twitter:image" content=".*?" \/>/s, `<meta name="twitter:image" content="${blogImg}" />`);

        const blogPostingSchema = {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
          "headline": post.title,
          "description": post.excerpt,
          "image": [blogImg],
          "datePublished": post.publishedIso || "2024-10-12T08:00:00+00:00",
          "dateModified": new Date().toISOString(),
          "author": {
            "@type": "Person",
            "name": post.author?.name || "Manuel Rosario",
            "jobTitle": post.author?.role || "Guía Certificado en La Altagracia"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Fire Tour DR",
            "url": "https://www.firetourdr.com",
            "logo": { "@type": "ImageObject", "url": "https://www.firetourdr.com/android-chrome-192x192.png" }
          },
          "articleSection": post.category,
          "inLanguage": "es"
        };

        const breadcrumbsSchema = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.firetourdr.com/" },
            { "@type": "ListItem", "position": 2, "name": "Guías de Viaje", "item": "https://www.firetourdr.com/blog" },
            { "@type": "ListItem", "position": 3, "name": post.title, "item": canonicalUrl }
          ]
        };

        const blogJsonLd = `<script type="application/ld+json">\n${JSON.stringify(blogPostingSchema, null, 2)}\n</script>\n    <script type="application/ld+json">\n${JSON.stringify(breadcrumbsSchema, null, 2)}\n</script>`;

        // Build article-specific FAQPage
        const faqEntities = (post.content?.sections || [])
          .filter(sec => sec.heading && sec.heading.length > 8)
          .slice(0, 4)
          .map(sec => ({
            "@type": "Question",
            "name": sec.heading.replace(/^\d+\.\s*/, '').trim(),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": (sec.body || []).join(' ').replace(/["\r\n]+/g, ' ').slice(0, 320) + (sec.tip ? ` Consejo: ${sec.tip}` : '')
            }
          }));

        const faqJsonLd = faqEntities.length > 0
          ? `<script type="application/ld+json">\n${JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": faqEntities }, null, 2)}\n</script>`
          : null;

        // Replace each JSON-LD script block independently (never crosses </script> boundaries)
        html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (match, body) => {
          if (body.includes('"@type": "TravelAgency"')) return blogJsonLd;
          if (faqJsonLd && body.includes('"@type": "FAQPage"')) return faqJsonLd;
          return match;
        });
      }
    } else if (pathname.startsWith('/excursion/')) {
      const tourId = pathname.replace('/excursion/', '');
      const tour = tours.find(t => String(t.id) === String(tourId));
      if (tour) {
        const tourImg = tour.image
          ? (tour.image.startsWith('http') ? tour.image : `https://www.firetourdr.com${tour.image}`)
          : 'https://www.firetourdr.com/tours/excursions/tour_1/001.jpg';

        html = html.replace(/<meta property="og:image" content=".*?" \/>/s, `<meta property="og:image" content="${tourImg}" />`);
        html = html.replace(/<meta name="twitter:image" content=".*?" \/>/s, `<meta name="twitter:image" content="${tourImg}" />`);

        let tourSchema;
        if (tourId === '4') {
          // Transfers have no fixed price (quoted on WhatsApp)
          tourSchema = {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": tour.name,
            "description": description,
            "image": [tourImg],
            "provider": {
              "@type": "TravelAgency",
              "name": "Fire Tour DR",
              "url": "https://www.firetourdr.com",
              "telephone": "+1-587-225-7342"
            },
            "areaServed": "Punta Cana, Dominican Republic"
          };
        } else {
          const verifiedPrice =
            tourId === '1' ? '75.00' :
            tourId === '2' ? '120.00' :
            tourId === '3' ? '120.00' :
            (tour.price ? Number(tour.price).toFixed(2) : '75.00');

          tourSchema = {
            "@context": "https://schema.org",
            "@type": ["Product", "TouristTrip"],
            "name": tour.name,
            "description": description,
            "image": [tourImg],
            "brand": { "@type": "Brand", "name": "Fire Tour DR" },
            "provider": {
              "@type": "TravelAgency",
              "name": "Fire Tour DR",
              "url": "https://www.firetourdr.com",
              "telephone": "+1-587-225-7342"
            },
            "offers": {
              "@type": "Offer",
              "url": canonicalUrl,
              "priceCurrency": "USD",
              "price": verifiedPrice,
              "priceValidUntil": "2027-12-31",
              "availability": "https://schema.org/InStock",
              "itemCondition": "https://schema.org/NewCondition"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": tour.rating ? String(tour.rating) : "4.9",
              "reviewCount": tour.reviews ? String(tour.reviews) : "1250",
              "bestRating": "5",
              "worstRating": "1"
            }
          };
        }

        const breadcrumbsSchema = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.firetourdr.com/" },
            { "@type": "ListItem", "position": 2, "name": "Excursiones", "item": "https://www.firetourdr.com/excursiones" },
            { "@type": "ListItem", "position": 3, "name": tour.name, "item": canonicalUrl }
          ]
        };

        const tourJsonLd = `<script type="application/ld+json">\n${JSON.stringify(tourSchema, null, 2)}\n</script>\n    <script type="application/ld+json">\n${JSON.stringify(breadcrumbsSchema, null, 2)}\n</script>`;
        html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (match, body) => {
          if (body.includes('"@type": "TravelAgency"')) return tourJsonLd;
          return match;
        });
      }
    }

    // Inject initial data script if present
    const initialDataScript = Object.keys(initialData).length > 0 
      ? `\n    <script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};</script>` 
      : '';

    // Replace Root shell with real HTML
    if (appHtml) {
      const rootRegex = /<div id="root">[\s\S]*?<\/div>\s*<\/body>/;
      html = html.replace(rootRegex, `<div id="root">${appHtml}</div>${initialDataScript}\n  </body>`);
    }

    // Write file to target path
    const targetFilePath = pathname === '/' 
      ? path.join(distDir, 'index.html') 
      : path.join(distDir, pathname.replace(/^\//, ''), 'index.html');

    const targetDir = path.dirname(targetFilePath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(targetFilePath, html, 'utf8');

    // Also write .html file at parent level (e.g. dist/blog.html, dist/excursion/1.html)
    // to guarantee direct 200 OK without trailing-slash redirects on any server/CDN
    if (pathname !== '/') {
      const flatFilePath = path.join(distDir, `${pathname.replace(/^\//, '')}.html`);
      const flatDir = path.dirname(flatFilePath);
      if (!fs.existsSync(flatDir)) {
        fs.mkdirSync(flatDir, { recursive: true });
      }
      fs.writeFileSync(flatFilePath, html, 'utf8');
    }

    renderedCount++;
  }

  // Clean up temporary SSR bundle
  try {
    fs.rmSync(distServerDir, { recursive: true, force: true });
  } catch (e) {}

  console.log(`Successfully pre-rendered ${renderedCount} pages with real HTML, unique titles, descriptions, and self-canonicals!`);
}

run().catch(err => {
  console.error('Fatal pre-rendering error:', err);
  process.exit(1);
});
