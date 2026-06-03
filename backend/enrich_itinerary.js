const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.json');
let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Helper arrays for itinerary generation
const adventureItinerary = [
  { time: "08:00 AM", title: "Recogida en el Hotel", desc: "Nuestro transporte VIP climatizado te recogerá en el lobby principal." },
  { time: "09:30 AM", title: "Llegada al Rancho Base", desc: "Briefing de seguridad, entrega de equipo protector y firma de responsabilidades." },
  { time: "10:00 AM", title: "Ruta Off-Road", desc: "Comienza la aventura. Aceleración por caminos de tierra, fango y selva tropical." },
  { time: "11:30 AM", title: "Visita al Cenote", desc: "Parada estratégica para nadar en una cueva subterránea de aguas cristalinas." },
  { time: "12:30 PM", title: "Playa Macao", desc: "Tiempo libre en la espectacular Playa Macao para fotos y relajación." },
  { time: "01:30 PM", title: "Regreso", desc: "Retorno al rancho y traslado seguro de vuelta a tu hotel." }
];

const waterItinerary = [
  { time: "07:30 AM", title: "Transporte Costero", desc: "Recogida en tu hotel y traslado al puerto privado de embarque." },
  { time: "09:00 AM", title: "Zarpamos hacia el Caribe", desc: "Abordaje del catamarán de lujo con bebida de bienvenida y música ambiente." },
  { time: "10:30 AM", title: "Snorkel en Arrecifes", desc: "Inmersión guiada para observar peces tropicales y la barrera de coral." },
  { time: "12:00 PM", title: "Piscina Natural", desc: "Parada en aguas poco profundas (cintura) con barra libre en el agua." },
  { time: "01:30 PM", title: "Almuerzo VIP", desc: "Degustación de gastronomía local o comida buffet premium." },
  { time: "03:30 PM", title: "Navegación de Retorno", desc: "Fiesta a bordo durante el regreso al puerto y traslado a tu hotel." }
];

const relaxItinerary = [
  { time: "08:30 AM", title: "Recogida Premium", desc: "Chofer privado te recogerá directamente en tu resort." },
  { time: "09:30 AM", title: "Llegada y Bienvenida", desc: "Recepción con bebidas refrescantes y asignación de guía personal." },
  { time: "10:00 AM", title: "Paseo Escénico", desc: "Recorrido sereno disfrutando del paisaje y la naturaleza." },
  { time: "11:30 AM", title: "Parada Fotográfica", desc: "Llegada al mirador principal para capturar recuerdos inolvidables." },
  { time: "12:30 PM", title: "Retorno al Hotel", desc: "Traslado cómodo y seguro de regreso a tu alojamiento." }
];

db.tours.forEach(tour => {
  const title = tour.name.toLowerCase();
  
  if (tour.tag === "Adventure" || title.includes('buggy') || title.includes('atv')) {
    tour.itinerary = adventureItinerary;
  } else if (tour.tag === "Water" || title.includes('catamaran') || title.includes('saona') || title.includes('boat')) {
    tour.itinerary = waterItinerary;
  } else {
    tour.itinerary = relaxItinerary;
  }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log("Database successfully enriched with dynamic itineraries.");
