const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.json');
if (!fs.existsSync(dbPath)) {
  console.error("database.json not found!");
  process.exit(1);
}

let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log(`Loaded ${db.tours.length} tours from database.json.`);

// 1. Group all tour images by tag
const imagesByTag = {
  Adventure: [],
  Water: [],
  Relax: []
};

db.tours.forEach(tour => {
  const tag = tour.tag || 'Adventure';
  if (tour.image && !imagesByTag[tag].includes(tour.image)) {
    imagesByTag[tag].push(tour.image);
  }
});

console.log("Images grouped by tag:", {
  Adventure: imagesByTag.Adventure.length,
  Water: imagesByTag.Water.length,
  Relax: imagesByTag.Relax.length
});

// Helper function to shuffle an array
function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// 2. Clean up each tour and add the photos array
db.tours.forEach((tour, idx) => {
  // Regex to match phone numbers, like +1 (809) 785-7208, +1 809..., etc.
  const phoneRegex = /\+?\d{1,3}[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/g;
  
  // Clean tour name
  let name = tour.name || "";
  name = name.replace(phoneRegex, "");
  // Clean double newlines or trailing spaces
  name = name.replace(/\n\n/g, " ").replace(/\s+/g, " ").trim();
  
  // Custom cleanup for tour ID 1 to make it look exceptionally beautiful
  if (tour.id === 1) {
    name = "Fire Tour DR: Aventura Extrema en ATV, Buggy & Cenote Subterráneo";
    tour.tag = "Adventure";
  } else {
    // If the name still has weird scraped phrases, clean it up
    name = name.replace("Drive through stunning landscapes, explore a cave, swim in crystal-clear waters, and taste local flavors!", "Ultimate ATV, Buggy & Cenote Experience");
  }
  tour.name = name;

  // Clean tour description
  let desc = tour.desc || "";
  desc = desc.replace(phoneRegex, "");
  desc = desc.replace(/\n\n/g, " ").replace(/\s+/g, " ").trim();
  
  if (tour.id === 1) {
    desc = "Vive la excursión todoterreno más emocionante y completa de Punta Cana. Conduce potentes buggies o ATVs a través de senderos selváticos de barro, explora y nada en las refrescantes aguas de una cueva subterránea de piedra caliza y relájate en la espectacular y salvaje Playa Macao. Cerramos con broche de oro con degustaciones artesanales de café dominicano tostado al fuego, cacao orgánico y mamajuana en nuestro pintoresco rancho típico dominicano.";
  }
  tour.desc = desc;

  // Clean inclusions
  if (tour.included) {
    tour.included = tour.included.map(item => item.replace(phoneRegex, "").trim()).filter(Boolean);
  }

  // Clean itineraries
  if (tour.itinerary) {
    tour.itinerary.forEach(step => {
      step.title = step.title.replace(phoneRegex, "").trim();
      step.desc = step.desc.replace(phoneRegex, "").trim();
    });
  }

  // 3. Populate photos array from the same category
  const tag = tour.tag || 'Adventure';
  const sameTagImages = imagesByTag[tag] || [];
  
  // Filter out the current tour's image
  const otherImages = sameTagImages.filter(img => img !== tour.image);
  
  // Shuffle other images and take 4
  const shuffledOthers = shuffle(otherImages);
  const selectedOthers = shuffledOthers.slice(0, 4);
  
  // Ensure we have exactly 5 images in the photos array
  let tourPhotos = [tour.image, ...selectedOthers];
  
  // If not enough images in the same tag, fill with images from other tags
  if (tourPhotos.length < 5) {
    const allImages = [...imagesByTag.Adventure, ...imagesByTag.Water, ...imagesByTag.Relax];
    const remainingImages = allImages.filter(img => !tourPhotos.includes(img));
    const shuffledRemaining = shuffle(remainingImages);
    tourPhotos = [...tourPhotos, ...shuffledRemaining.slice(0, 5 - tourPhotos.length)];
  }
  
  tour.photos = tourPhotos;
});

// Save cleaned database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

console.log("SUCCESS: database.json has been cleaned and enriched with real scraped photo arrays!");
