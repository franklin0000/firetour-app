const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.json');
let dbContent = fs.readFileSync(dbPath, 'utf8');
if (dbContent.charCodeAt(0) === 0xFEFF) dbContent = dbContent.slice(1);
const db = JSON.parse(dbContent);

function cleanUtf8(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/MÃ¡s Vendido/g, 'Más Vendido')
    .replace(/increÃ­ble/g, 'increíble')
    .replace(/guÃ­as/g, 'guías')
    .replace(/cortesÃ­a/g, 'cortesía')
    .replace(/Medio DÃ­a/g, 'Medio Día')
    .replace(/Â¡/g, '¡')
    .replace(/Ã¡/g, 'á')
    .replace(/Ã©/g, 'é')
    .replace(/Ã­/g, 'í')
    .replace(/Ã³/g, 'ó')
    .replace(/Ãº/g, 'ú')
    .replace(/Ã±/g, 'ñ');
}

// 1. Define the 4 TOP Core Excursions
const TOP_TOURS = [
  {
    id: 1,
    name: "Isla Saona All Inclusive VIP: Catamarán, Lancha Rápida & Piscina Natural",
    category: "saona",
    badge: "MÁS VENDIDO #1",
    badgeClass: "badge-accent",
    price: 79,
    rating: 4.9,
    reviews: 1420,
    tag: "Saona",
    image: "/tours/excursions/tour_1/001.jpg",
    desc: "¡La excursión número 1 de la República Dominicana! Navega en catamarán de vela con música, animación y barra libre, báñate en la famosa Piscina Natural con estrellas de mar gigantes y relájate en las playas vírgenes de arena blanca de Isla Saona con almuerzo buffet típico dominicano incluido.",
    duration: "Día Completo (8-9 hrs)",
    difficulty: "Fácil",
    included: [
      "Transporte ida y vuelta desde tu hotel",
      "Paseo en Catamarán de fiesta y Lancha Rápida",
      "Parada en Piscina Natural con estrellas de mar",
      "Almuerzo buffet dominicano en la playa",
      "Barra libre nacional (Ron, cerveza, refrescos, agua)",
      "Guía turístico certificado bilingüe",
      "Impuestos y brazalete de Parque Nacional Cotubanamá"
    ],
    photos: [
      "/tours/excursions/tour_1/001.jpg",
      "/tours/excursions/tour_1/002.jpg",
      "/tours/excursions/tour_1/003.jpg",
      "/tours/excursions/tour_1/004.jpg",
      "/tours/excursions/tour_1/005.jpg"
    ]
  },
  {
    id: 2,
    name: "Buggies 4x4 Macao: Cenote Subterráneo, Playa Salvaje & Degustación",
    category: "buggy",
    badge: "AVENTURA TOP",
    badgeClass: "badge-accent",
    price: 55,
    rating: 4.8,
    reviews: 1150,
    tag: "Buggy",
    image: "/tours/excursions/tour_2/001.jpg",
    desc: "¡Acelera a fondo por senderos selváticos en un potente buggy 4x4! Atraviesa caminos de barro, refréscate nadando en un cenote de cueva subterránea de aguas cristalinas, visita la impresionante Playa Macao y degusta café artesanal, cacao orgánico y mamajuana en un rancho típico.",
    duration: "Medio Día (4 hrs)",
    difficulty: "Media",
    included: [
      "Recogida y regreso en tu resort",
      "Buggy 4x4 todoterreno y casco de protección",
      "Guía líder de caravana y equipo de asistencia",
      "Nado en cueva subterránea (Cenote indígena)",
      "Parada libre en la salvaje Playa Macao",
      "Degustación de café, cacao y mamajuana dominicana"
    ],
    photos: [
      "/tours/excursions/tour_2/001.jpg",
      "/tours/excursions/tour_2/002.jpg",
      "/tours/excursions/tour_2/003.jpg",
      "/tours/excursions/tour_2/004.jpg",
      "/tours/excursions/tour_2/005.jpg"
    ]
  },
  {
    id: 3,
    name: "Parasailing Punta Cana: Vuelo Panorámico sobre Bávaro con Recogida Gratis",
    category: "parasail",
    badge: "VISTA 360°",
    badgeClass: "badge-cyan",
    price: 75,
    rating: 4.9,
    reviews: 840,
    tag: "Parasail",
    image: "/tours/excursions/tour_3/001.jpg",
    desc: "¡Vuela sobre las impresionantes aguas turquesas del Caribe a más de 150 metros de altura! Disfruta de vistas panorámicas 360° de toda la costa de Bávaro y Punta Cana con despegue y aterrizaje suave directo en la plataforma del barco. Seguro, emocionante e inolvidable.",
    duration: "1 hora (10-12 min en el aire)",
    difficulty: "Fácil",
    included: [
      "Transporte ida y vuelta desde tu hotel",
      "Vuelo en paracaídas biplaza o individual",
      "Lancha rápida moderna con plataforma hidráulica",
      "Arnés de máxima seguridad y chaleco salvavidas",
      "Capitán y tripulación profesional certificada",
      "Instrucciones de seguridad y asistencia completa"
    ],
    photos: [
      "/tours/excursions/tour_3/001.jpg",
      "/tours/excursions/tour_3/002.jpg",
      "/tours/excursions/tour_3/003.jpg",
      "/tours/excursions/tour_3/004.jpg",
      "/tours/excursions/tour_3/005.jpg"
    ]
  },
  {
    id: 4,
    name: "Traslado Privado Aeropuerto Punta Cana (PUJ) - Ida y Vuelta en Confort VIP",
    category: "transfer",
    badge: "SERVICIO VIP",
    badgeClass: "badge-secondary",
    price: 45,
    rating: 4.9,
    reviews: 970,
    tag: "Transfer",
    image: "/tours/excursions/tour_4/001.jpg",
    desc: "Olvídate de las filas y el estrés al aterrizar en el Aeropuerto Internacional de Punta Cana (PUJ). Tu chofer profesional te esperará con un cartel personalizado para llevarte directo a tu hotel o resort en vehículo moderno con aire acondicionado, Wi-Fi y confort garantizado.",
    duration: "25 - 45 min",
    difficulty: "Fácil",
    included: [
      "Recepción personalizada con cartel a tu nombre",
      "Monitoreo de vuelo en tiempo real (sin cargos por demoras)",
      "Vehículo privado exclusivo (sin paradas compartidas)",
      "Aire acondicionado y asistencia con todo el equipaje",
      "Agua embotellada fría de bienvenida",
      "Disponible 24 horas los 7 días de la semana"
    ],
    photos: [
      "/tours/excursions/tour_4/001.jpg",
      "/tours/excursions/tour_4/002.jpg",
      "/tours/excursions/tour_4/003.jpg",
      "/tours/excursions/tour_4/004.jpg",
      "/tours/excursions/tour_4/005.jpg"
    ]
  }
];

// Helper to categorize remaining tours
function detectCategory(name, desc) {
  const text = (name + ' ' + (desc || '')).toLowerCase();
  if (text.includes('saona')) return { cat: 'saona', tag: 'Saona', badge: 'Isla Saona' };
  if (text.includes('buggy') || text.includes('boogie') || text.includes('atv') || text.includes('4x4') || text.includes('dune')) return { cat: 'buggy', tag: 'Buggy', badge: 'Aventura 4x4' };
  if (text.includes('parasail') || text.includes('paracel')) return { cat: 'parasail', tag: 'Parasail', badge: 'Vuelo Panorámico' };
  if (text.includes('transfer') || text.includes('airport') || text.includes('shuttle') || text.includes('transfers') || text.includes('transportation')) return { cat: 'transfer', tag: 'Transfer', badge: 'Traslado VIP' };
  if (text.includes('coco bongo') || text.includes('party boat') || text.includes('night') || text.includes('drink point') || text.includes('disco')) return { cat: 'nightlife', tag: 'Nightlife', badge: 'Vida Nocturna' };
  if (text.includes('catamaran') || text.includes('boat') || text.includes('snorkel') || text.includes('diving') || text.includes('scuba') || text.includes('fishing') || text.includes('dolphin') || text.includes('catalina')) return { cat: 'water', tag: 'Water', badge: 'Acuática' };
  if (text.includes('zipline') || text.includes('zip line') || text.includes('safari') || text.includes('horseback') || text.includes('riding') || text.includes('adventure')) return { cat: 'adventure', tag: 'Adventure', badge: 'Aventura' };
  return { cat: 'relax', tag: 'Relax', badge: 'Ecoturismo' };
}

// Map the rest of tours (id >= 5)
const updatedRestTours = [];

for (let t of db.tours) {
  if (t.id >= 1 && t.id <= 4) continue; // Skip old 1..4 as they are replaced by our 4 stars

  // Clean strings
  t.badge = cleanUtf8(t.badge);
  t.desc = cleanUtf8(t.desc);
  t.duration = cleanUtf8(t.duration);
  if (Array.isArray(t.included)) {
    t.included = t.included.map(inc => cleanUtf8(inc));
  }

  // Detect category and tag
  const detected = detectCategory(t.name, t.desc);
  t.category = detected.cat;
  t.tag = detected.tag;
  if (!t.badge || t.badge === 'Más Vendido' || t.badge.includes('MÃ¡s')) {
    t.badge = detected.badge;
  }
  if (!t.badgeClass) {
    t.badgeClass = 'badge-accent';
  }

  updatedRestTours.push(t);
}

// Assemble final tours list
db.tours = [...TOP_TOURS, ...updatedRestTours];

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

console.log('Successfully organized database with Top 4 Core Tours!');
console.log('Total tours:', db.tours.length);
console.log('Top 4 tours:');
db.tours.slice(0, 4).forEach(t => console.log(`[${t.id}] ${t.name} ($${t.price} USD) - Category: ${t.category} - Tag: ${t.tag}`));
