const fs = require('fs');
const path = require('path');

const srcDir = path.join('C:', 'Users', 'bot', 'Desktop', 'Fotos_Excursiones_Punta_Cana');
const destDirBase = path.join(__dirname, '../frontend/public/tours/excursions');
const dbPath = path.join(__dirname, 'database.json');

// Read DB
let dbContent = fs.readFileSync(dbPath, 'utf8');
if (dbContent.charCodeAt(0) === 0xFEFF) dbContent = dbContent.slice(1);
const db = JSON.parse(dbContent);

// Get source folders sorted
const excursionFolders = fs.readdirSync(srcDir)
  .filter(f => fs.statSync(path.join(srcDir, f)).isDirectory())
  .sort();

let copiedTours = 0;

for (let i = 0; i < Math.min(excursionFolders.length, db.tours.length); i++) {
  const folderName = excursionFolders[i];
  const tour = db.tours[i];
  
  const srcFolderPath = path.join(srcDir, folderName);
  const destFolderPath = path.join(destDirBase, `tour_${tour.id}`);
  
  // Ensure dest folder exists
  if (!fs.existsSync(destFolderPath)) {
    fs.mkdirSync(destFolderPath, { recursive: true });
  } else {
    // Clean old files in it
    fs.readdirSync(destFolderPath).forEach(f => {
      fs.unlinkSync(path.join(destFolderPath, f));
    });
  }

  // Get up to 5 images from src
  const files = fs.readdirSync(srcFolderPath)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort();
    
  const selectedFiles = files.slice(0, 5);
  const localPhotos = [];
  
  // Copy files
  selectedFiles.forEach((file, index) => {
    const srcFile = path.join(srcFolderPath, file);
    const ext = path.extname(file).toLowerCase();
    const newName = `00${index + 1}`.slice(-3) + ext;
    const destFile = path.join(destFolderPath, newName);
    
    fs.copyFileSync(srcFile, destFile);
    localPhotos.push(`/tours/excursions/tour_${tour.id}/${newName}`);
  });
  
  // Update DB
  if (localPhotos.length > 0) {
    tour.image = localPhotos[0];
    tour.photos = localPhotos;
    copiedTours++;
  }
}

// Save DB
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`Successfully organized photos for ${copiedTours} tours.`);
