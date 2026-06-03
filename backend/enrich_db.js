const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.json');
let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Helper arrays for rich content generation
const waterInclusions = ["Crucero de lujo", "Equipos de snorkel premium", "Barra libre nacional e internacional", "Animación en vivo y DJ", "Frutas tropicales frescas", "Parada en piscina natural"];
const adventureInclusions = ["Casco y equipo protector completo", "Guía líder de caravana", "Visita a cenote subterráneo", "Degustación de café orgánico", "Ruta extrema off-road", "Asistencia mecánica"];
const relaxInclusions = ["Recogida VIP en vehículo climatizado", "Guía bilingüe experto", "Botellas de agua purificada", "Tiempo libre para fotos", "Entradas y permisos incluidos"];

function getRandom(arr, count) {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

db.tours.forEach(tour => {
  const title = tour.name.toLowerCase();
  
  // 1. Generate realistic duration & difficulty
  if (title.includes('buggy') || title.includes('atv') || title.includes('zipline') || title.includes('safari')) {
    tour.duration = ["3.5 horas", "4 horas", "Media Jornada"][Math.floor(Math.random() * 3)];
    tour.difficulty = "Media / Extrema";
    tour.tag = "Adventure";
    tour.included = ["Transporte ida y vuelta"].concat(getRandom(adventureInclusions, 4));
    tour.desc = `Prepárate para ensuciarte y sentir la adrenalina. ${tour.name.replace('Fire Tour DR: ', '')} es una expedición diseñada para los amantes de la emoción. Acelera por caminos de tierra, atraviesa selvas tropicales vírgenes y refréscate en aguas subterráneas cristalinas. Nuestros guías expertos de Fire Tour DR te acompañarán paso a paso garantizando tu seguridad total.`;
  } 
  else if (title.includes('catamaran') || title.includes('saona') || title.includes('snorkel') || title.includes('boat') || title.includes('cruise')) {
    tour.duration = title.includes('saona') ? "9 horas" : ["3 horas", "4 horas"][Math.floor(Math.random() * 2)];
    tour.difficulty = "Fácil";
    tour.tag = "Water";
    tour.included = ["Traslado costero"].concat(getRandom(waterInclusions, 4));
    if (title.includes('saona')) tour.included.push("Almuerzo Buffet VIP");
    tour.desc = `Navega por las espectaculares aguas turquesas del Mar Caribe con ${tour.name.replace('Fire Tour DR: ', '')}. Disfruta de la suave brisa marina, descubre la vibrante vida de los arrecifes de coral y relájate con una bebida tropical en mano. Una experiencia acuática inmersiva de primera clase.`;
  }
  else if (title.includes('horse') || title.includes('caballo') || title.includes('sunset')) {
    tour.duration = ["2 horas", "2.5 horas"][Math.floor(Math.random() * 2)];
    tour.difficulty = "Fácil";
    tour.tag = "Relax";
    tour.included = ["Caballo entrenado", "Instructor de equitación"].concat(getRandom(relaxInclusions, 3));
    tour.desc = `Conecta con la naturaleza en estado puro. ${tour.name.replace('Fire Tour DR: ', '')} ofrece un recorrido sereno por paisajes impresionantes, alejándote del bullicio de los resorts. Siente la brisa fresca mientras recorres senderos inexplorados, ideal para parejas y familias que buscan una tarde inolvidable.`;
  }
  else {
    // Generic but rich fallback
    tour.duration = ["4 horas", "5 horas", "Día Completo"][Math.floor(Math.random() * 3)];
    tour.difficulty = "Fácil / Media";
    tour.included = ["Recogida en hotel", "Guía local certificado"].concat(getRandom(relaxInclusions, 3));
    tour.desc = `Descubre los secretos mejor guardados de Punta Cana. La excursión ${tour.name.replace('Fire Tour DR: ', '')} te sumerge en la auténtica cultura y geografía caribeña. Con la garantía de calidad de Fire Tour DR, vivirás momentos fotográficos únicos y un servicio impecable de principio a fin.`;
  }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log("Database successfully enriched with highly contextual descriptions and inclusions.");
