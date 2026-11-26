const fs = require('fs');
const path = require('path');

function generateSitemap() {
  console.log('--- Generating Dynamic Sitemap for Fire Tour DR ---');

  const today = new Date().toISOString().split('T')[0];
  const publicDir = path.resolve(__dirname, '../public');
  const distDir = path.resolve(__dirname, '../dist');

  // Load tours
  const toursDataPath = path.join(publicDir, 'data', 'tours.json');
  let tours = [];
  if (fs.existsSync(toursDataPath)) {
    tours = JSON.parse(fs.readFileSync(toursDataPath, 'utf8')).tours || [];
  }

  // Load blog posts from blogData.ts
  const blogDataPath = path.resolve(__dirname, '../src/data/blogData.ts');
  const blogContent = fs.readFileSync(blogDataPath, 'utf8');
  const blogSlugs = [...blogContent.matchAll(/slug:\s*["']([^"']+)["']/g)].map(m => m[1]);

  // Load resorts
  const resorts = [
    "hard-rock-hotel-punta-cana",
    "riu-republica",
    "riu-palace-punta-cana",
    "barcelo-bavaro-palace",
    "grand-palladium-punta-cana",
    "bahia-principe-bavaro",
    "iberostar-grand-bavaro",
    "secrets-royal-beach",
    "lopesan-costa-bavaro",
    "dreams-onyx-punta-cana",
    "majestic-elegance-punta-cana",
    "hyatt-ziva-cap-cana"
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  // 1. Core Static Pages
  const staticPages = [
    { loc: "https://www.firetourdr.com/", priority: "1.0", freq: "daily" },
    { loc: "https://www.firetourdr.com/excursiones", priority: "0.9", freq: "daily" },
    { loc: "https://www.firetourdr.com/reviews", priority: "0.95", freq: "daily" },
    { loc: "https://www.firetourdr.com/vender-tours", priority: "0.85", freq: "weekly" },
    { loc: "https://www.firetourdr.com/republica-dominicana", priority: "1.0", freq: "daily" },
    { loc: "https://www.firetourdr.com/punta-cana", priority: "0.98", freq: "daily" },
    { loc: "https://www.firetourdr.com/blog", priority: "0.95", freq: "daily" },
    { loc: "https://www.firetourdr.com/sobre-nosotros", priority: "0.8", freq: "monthly" },
    { loc: "https://www.firetourdr.com/contacto", priority: "0.8", freq: "monthly" },
    { loc: "https://www.firetourdr.com/vuelos", priority: "0.8", freq: "weekly" },
    { loc: "https://www.firetourdr.com/politica-de-privacidad", priority: "0.3", freq: "yearly" },
    { loc: "https://www.firetourdr.com/eliminar-cuenta", priority: "0.3", freq: "yearly" },
    { loc: "https://www.firetourdr.com/terminos-y-condiciones", priority: "0.3", freq: "yearly" }
  ];

  staticPages.forEach(p => {
    xml += `  <url>\n    <loc>${p.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.freq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>\n`;
  });

  // 2. Editorial Blog Guides (High Priority for Google Search Console)
  blogSlugs.forEach(slug => {
    xml += `  <url>\n    <loc>https://www.firetourdr.com/blog/${slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.92</priority>\n  </url>\n`;
  });

  // 3. Programmatic Resort Landing Pages
  resorts.forEach(slug => {
    xml += `  <url>\n    <loc>https://www.firetourdr.com/hoteles/${slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.90</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>https://www.firetourdr.com/excursiones-desde/${slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
  });

  // 4. Tour Product Pages with Image Extensions
  tours.forEach(tour => {
    const prio = tour.id <= 4 ? "0.95" : "0.75";
    const cleanName = (tour.name || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    xml += `  <url>\n    <loc>https://www.firetourdr.com/excursion/${tour.id}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${prio}</priority>\n`;
    if (tour.image) {
      const imgUrl = tour.image.startsWith("http") ? tour.image : `https://www.firetourdr.com${tour.image}`;
      xml += `    <image:image>\n      <image:loc>${imgUrl}</image:loc>\n      <image:title>${cleanName}</image:title>\n    </image:image>\n`;
    }
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;

  // Write to public/ and dist/ if exists
  const publicSitemap = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(publicSitemap, xml, 'utf8');

  if (fs.existsSync(distDir)) {
    const distSitemap = path.join(distDir, 'sitemap.xml');
    fs.writeFileSync(distSitemap, xml, 'utf8');
  }

  const totalUrls = staticPages.length + blogSlugs.length + (resorts.length * 2) + tours.length;
  console.log(`[Success] Dynamically generated sitemap.xml with ${totalUrls} verified URLs (Date: ${today}).`);
}

generateSitemap();
