const fs = require('fs');
const path = require('path');

const SOURCE_DIR = 'C:\\Users\\bot\\Desktop\\Fotos_Excursiones_Punta_Cana';
const TARGET_DIR = path.join(__dirname, 'uploads');
const DB_FILE = path.join(__dirname, 'database.json');

// Ensure target directory exists
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR);
}

// Function to clean the folder name into a nice title
function cleanTitle(folderName) {
  // Remove the __d794-xxx or __d32-xxx suffix
  let cleaned = folderName.replace(/__d\d+-\d+$/, '');
  // Replace underscores with spaces
  cleaned = cleaned.replace(/_/g, ' ');
  // Capitalize properly
  return cleaned.trim();
}

async function runImport() {
  console.log("Starting import process...");
  const folders = fs.readdirSync(SOURCE_DIR);
  
  let newTours = [];
  let tourId = 1;

  for (const folder of folders) {
    const folderPath = path.join(SOURCE_DIR, folder);
    
    if (fs.statSync(folderPath).isDirectory()) {
      const files = fs.readdirSync(folderPath);
      // Find ALL images
      const imageFiles = files.filter(file => file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.png') || file.toLowerCase().endsWith('.jpeg'));
      
      if (imageFiles.length > 0) {
        let photoUrls = [];
        let firstImageName = "";
        
        for (let i = 0; i < imageFiles.length; i++) {
            const ext = path.extname(imageFiles[i]);
            const newImageName = `tour_${tourId}_${i}${ext}`;
            const sourceImage = path.join(folderPath, imageFiles[i]);
            const targetImage = path.join(TARGET_DIR, newImageName);
            
            // Copy image
            fs.copyFileSync(sourceImage, targetImage);
            
            photoUrls.push(`http://localhost:5000/uploads/${newImageName}`);
            if (i === 0) {
                firstImageName = `http://localhost:5000/uploads/${newImageName}`;
            }
        }
        
        // Generate random stats
        const price = Math.floor(Math.random() * 101) + 50; // 50 to 150
        const rating = (4.0 + Math.random() * 0.9).toFixed(1);
        const reviews = Math.floor(Math.random() * 800) + 100;
        
        // Add to tours array
        newTours.push({
          id: tourId,
          name: cleanTitle(folder),
          category: "booking",
          badge: tourId <= 5 ? "Más Vendido" : "",
          badgeClass: "badge-accent",
          price: price,
          rating: parseFloat(rating),
          reviews: reviews,
          tag: "Adventure",
          image: firstImageName,
          photos: photoUrls,
          desc: `Disfruta de esta increíble aventura en Punta Cana con los mejores guías y un servicio de primera clase. ¡Reserva ahora y vive la experiencia con Fire Tour DR!`,
          duration: "Medio Día",
          difficulty: "Media",
          included: ["Transporte", "Guía VIP", "Bebida de cortesía"]
        });
        
        tourId++;
      } else {
        console.log(`⚠️ No image found in folder: ${folder}`);
      }
    }
  }

  console.log(`Processed ${newTours.length} tours with unique images.`);

  // Read current DB and replace tours
  let currentDb = { tours: [], reservations: [], chat_messages: [] };
  if (fs.existsSync(DB_FILE)) {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    try {
      currentDb = JSON.parse(data);
    } catch (e) {
      console.log("DB parsing error, using default empty DB.");
    }
  }

  currentDb.tours = newTours;

  // Save back to DB
  fs.writeFileSync(DB_FILE, JSON.stringify(currentDb, null, 2), 'utf8');
  console.log("✅ database.json updated successfully!");
}

runImport();
