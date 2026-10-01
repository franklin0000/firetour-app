const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');

const INITIAL_TOURS = [
  {
    id: 1,
    name: "Fire Tour DR: Ultimate ATV & Buggy Adventure",
    category: "booking",
    badge: "Más Vendido",
    badgeClass: "badge-accent",
    price: 35,
    rating: 4.8,
    reviews: 1245,
    tag: "Adventure",
    image: "https://media.tacdn.com/media/attractions-splice-spp-674x446/09/cc/62/08.jpg",
    desc: "¡Vive la máxima aventura todoterreno exclusiva de Fire Tour DR en Punta Cana! Acelera por senderos salvajes en un ATV o Buggy, explora una caverna natural de piedra caliza y nada en las aguas cristalinas de la playa Macao.",
    duration: "4 horas",
    difficulty: "Media",
    included: ["Buggy 4x4 garantizado por Fire Tour DR", "Casco y equipo de seguridad", "Guía VIP", "Visita a cueva subterránea", "Parada en Playa Macao"]
  },
  {
    id: 2,
    name: "Fire Tour DR: Sunset Horseback VIP Riding",
    category: "booking",
    badge: "Exclusivo",
    badgeClass: "badge-secondary",
    price: 103,
    rating: 4.9,
    reviews: 890,
    tag: "Relax",
    image: "https://media.tacdn.com/media/attractions-splice-spp-674x446/0f/c6/16/e0.jpg",
    desc: "Disfruta de una tarde mágica y romántica montando a caballo por las costas de Punta Cana al atardecer. Una experiencia privada diseñada por Fire Tour DR para conectarte con la belleza natural del Caribe.",
    duration: "2 horas",
    difficulty: "Fácil",
    included: ["Caballo entrenado de paso fino", "Instructor privado de Fire Tour DR", "Casco de seguridad", "Bebida de cortesía", "Recogida VIP"]
  },
  {
    id: 3,
    name: "Fire Tour DR: Combo Cabalgata & Buggy Macao",
    category: "booking",
    badge: "Aventura Extrema",
    badgeClass: "badge-cyan",
    price: 108,
    rating: 4.7,
    reviews: 512,
    tag: "Adventure",
    image: "https://media.tacdn.com/media/attractions-splice-spp-674x446/09/cc/62/11.jpg",
    desc: "¡El combo de aventura definitivo de Fire Tour DR! Disfruta de un pintoresco paseo a caballo por senderos naturales, luego cambia a un potente Buggy para chapotear en el barro hacia la Cueva de Agua y Playa Macao.",
    duration: "4 horas",
    difficulty: "Media",
    included: ["Paseo a caballo costero", "Buggy 4x4", "Guías certificados", "Entrada a cenote subterráneo", "Traslados al hotel"]
  },
  {
    id: 4,
    name: "Fire Tour DR: Coastal Horseback Experience",
    category: "booking",
    badge: "Relajante",
    badgeClass: "badge-cyan",
    price: 82,
    rating: 4.8,
    reviews: 315,
    tag: "Relax",
    image: "https://media.tacdn.com/media/attractions-splice-spp-674x446/06/6c/5c/38.jpg",
    desc: "Siente la brisa del océano mientras montas un caballo dócil y bien entrenado a lo largo de las playas vírgenes de Punta Cana. Ideal tanto para principiantes como para jinetes expertos bajo la supervisión de Fire Tour DR.",
    duration: "3 horas",
    difficulty: "Fácil",
    included: ["Cabalgata en la playa", "Instructor bilingüe", "Equipo de montar premium", "Botellas de agua purificada", "Transporte"]
  },
  {
    id: 5,
    name: "Fire Tour DR: Macao ATV Expedición Rápida",
    category: "booking",
    badge: "Express",
    badgeClass: "badge-accent",
    price: 27,
    rating: 4.6,
    reviews: 1205,
    tag: "Adventure",
    image: "https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/2a/39/10.jpg",
    desc: "¡Un día lleno de acción sin gastar de más! Conduce tu propio buggy por senderos tropicales, sumérgete en una refrescante piscina de cueva subterránea y relájate en las arenas doradas de Macao Beach con Fire Tour DR.",
    duration: "3 horas",
    difficulty: "Media",
    included: ["Buggy compartido", "Equipo de seguridad", "Guía líder de caravana", "Visita a cueva Taina", "Recogida grupal"]
  },
  {
    id: 6,
    name: "Fire Tour DR: Catamarán & Snorkeling",
    category: "booking",
    badge: "Fiesta Náutica",
    badgeClass: "badge-cyan",
    price: 75,
    rating: 4.7,
    reviews: 288,
    tag: "Water",
    image: "https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/d9/85/3c.jpg",
    desc: "Disfruta de la mejor fiesta en el mar con este crucero en Catamarán por la costa de Bávaro. Haz snorkel en el arrecife de coral y finaliza con bebidas flotantes en la famosa piscina natural de Punta Cana.",
    duration: "4 horas",
    difficulty: "Fácil",
    included: ["Crucero en catamarán", "Equipos de snorkel", "Barra libre y nachos", "Parada en piscina natural", "Fiesta con DJ animador"]
  }
];

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initialData = {
        tours: INITIAL_TOURS,
        reservations: [],
        users: [],
        chat_messages: [
          {
            id: 1,
            sender: "agent",
            text: "¡Hola! Bienvenido al chat de soporte de Fire Tour DR. ¿En qué puedo ayudarte a planear tus vacaciones en Punta Cana hoy?",
            timestamp: new Date().toISOString()
          }
        ]
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
      return initialData;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Database reading error: ", err);
    return { tours: INITIAL_TOURS, reservations: [], chat_messages: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error("Database writing error: ", err);
    return false;
  }
}

module.exports = {
  getUsers: () => {
    const db = readDB();
    return db.users || [];
  },
  getUserByEmail: (email) => {
    const db = readDB();
    return (db.users || []).find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  addUser: (user) => {
    const db = readDB();
    if (!db.users) db.users = [];
    const newUser = {
      id: db.users.length + 1,
      createdAt: new Date().toISOString(),
      ...user
    };
    db.users.push(newUser);
    writeDB(db);
    return newUser;
  },
  getTours: () => {
    const db = readDB();
    return db.tours;
  },
  getTourById: (id) => {
    const db = readDB();
    return db.tours.find(t => t.id === parseInt(id));
  },
  getReservations: () => {
    const db = readDB();
    return db.reservations;
  },
  addReservation: (reservation) => {
    const db = readDB();
    const newReservation = {
      id: db.reservations.length + 1,
      ticketCode: "FTDR-" + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      ...reservation
    };
    db.reservations.push(newReservation);
    writeDB(db);
    return newReservation;
  },
  getChatMessages: () => {
    const db = readDB();
    return db.chat_messages;
  },
  addChatMessage: (sender, text) => {
    const db = readDB();
    const newMessage = {
      id: db.chat_messages.length + 1,
      sender,
      text,
      timestamp: new Date().toISOString()
    };
    db.chat_messages.push(newMessage);
    writeDB(db);
    return newMessage;
  },
  updateTour: (id, updatedData) => {
    const db = readDB();
    const index = db.tours.findIndex(t => t.id === parseInt(id));
    if (index !== -1) {
      db.tours[index] = { ...db.tours[index], ...updatedData, id: parseInt(id) }; // Ensure ID doesn't change
      writeDB(db);
      return db.tours[index];
    }
    return null;
  },
  getReviews: (tourId) => {
    const db = readDB();
    const all = db.reviews || [];
    if (!tourId || tourId === 'all') {
      return all;
    }
    const targetId = parseInt(tourId);
    return all.filter(r => r.tourId === targetId || String(r.tourId) === String(tourId));
  },
  addReview: (reviewData) => {
    const db = readDB();
    if (!db.reviews) db.reviews = [];
    
    const gradients = [
      'from-blue-500 to-teal-400',
      'from-amber-500 to-orange-600',
      'from-purple-500 to-indigo-500',
      'from-emerald-500 to-teal-500',
      'from-pink-500 to-rose-600',
      'from-cyan-500 to-blue-600'
    ];
    const randomBg = gradients[Math.floor(Math.random() * gradients.length)];

    const newReview = {
      id: Date.now(),
      tourId: reviewData.tourId ? parseInt(reviewData.tourId) : null,
      tourName: reviewData.tourName || 'Experiencia General Fire Tour DR',
      name: (reviewData.name || 'Viajero').trim(),
      email: (reviewData.email || '').trim(),
      rating: Math.min(5, Math.max(1, parseInt(reviewData.rating) || 5)),
      comment: (reviewData.comment || '').trim(),
      date: 'Hoy',
      createdAt: new Date().toISOString(),
      avatarBg: randomBg,
      helpfulCount: 0,
      verified: true,
      country: reviewData.country || 'República Dominicana'
    };

    db.reviews.unshift(newReview);

    // If review is for a specific tour, increment tour's review counter
    if (newReview.tourId && Array.isArray(db.tours)) {
      const tour = db.tours.find(t => t.id === newReview.tourId);
      if (tour) {
        tour.reviews = (tour.reviews || 0) + 1;
      }
    }

    writeDB(db);
    return newReview;
  },
  voteReviewHelpful: (reviewId) => {
    const db = readDB();
    if (!db.reviews) return null;
    const rev = db.reviews.find(r => r.id === parseInt(reviewId) || String(r.id) === String(reviewId));
    if (rev) {
      rev.helpfulCount = (rev.helpfulCount || 0) + 1;
      writeDB(db);
      return rev;
    }
    return null;
  },
  getPartnerApplications: () => {
    const db = readDB();
    return db.partner_applications || [];
  },
  addPartnerApplication: (appData) => {
    const db = readDB();
    if (!db.partner_applications) db.partner_applications = [];

    const newApp = {
      id: "partner_" + Date.now(),
      companyName: (appData.companyName || appData.contactName || 'Operador Turístico').trim(),
      contactName: (appData.contactName || '').trim(),
      phone: (appData.phone || '').trim(),
      email: (appData.email || '').trim().toLowerCase(),
      location: (appData.location || 'Punta Cana, República Dominicana').trim(),
      tourTitle: (appData.tourTitle || '').trim(),
      category: (appData.category || 'Aventura').trim(),
      description: (appData.description || '').trim(),
      duration: (appData.duration || 'Medio Día').trim(),
      priceAdult: parseFloat(appData.priceAdult) || 0,
      priceChild: appData.priceChild ? parseFloat(appData.priceChild) : null,
      capacity: appData.capacity || 'Hasta 20 personas',
      included: Array.isArray(appData.included) ? appData.included : (appData.included ? [appData.included] : []),
      photos: Array.isArray(appData.photos) ? appData.photos : [],
      status: 'pending_review',
      createdAt: new Date().toISOString()
    };

    db.partner_applications.unshift(newApp);
    writeDB(db);
    return newApp;
  }
};
