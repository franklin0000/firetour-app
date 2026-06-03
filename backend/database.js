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
  }
};
