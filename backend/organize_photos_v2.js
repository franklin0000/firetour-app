const fs = require('fs');
const path = require('path');

const srcDir = path.join('C:', 'Users', 'bot', 'Desktop', 'Fotos_Excursiones_Punta_Cana');
const destDirBase = path.join(__dirname, '../frontend/public/tours/excursions');
const dbPath = path.join(__dirname, 'database.json');

// Read DB
let dbContent = fs.readFileSync(dbPath, 'utf8');
if (dbContent.charCodeAt(0) === 0xFEFF) dbContent = dbContent.slice(1);
const db = JSON.parse(dbContent);

// Get source folders
const excursionFolders = fs.readdirSync(srcDir)
  .filter(f => fs.statSync(path.join(srcDir, f)).isDirectory());

let copiedTours = 0;

for (let tour of db.tours) {
  // Normalize tour name by removing special characters and lowering case
  const normalizedTourName = tour.name.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Find matching folder
  const folderName = excursionFolders.find(f => {
    // Some folders end with __d794-..., remove that part
    const baseName = f.split('__')[0].replace(/_/g, ' ');
    const normalizedFolderName = baseName.toLowerCase().replace(/[^a-z0-9]/g, '');
    return normalizedTourName === normalizedFolderName;
  });

  if (!folderName) {
    console.log(`[!] No matching folder found for: ${tour.name}`);
    continue;
  }
  
  const srcFolderPath = path.join(srcDir, folderName);
  const destFolderPath = path.join(destDirBase, `tour_${tour.id}`);
  
  // Ensure dest folder exists and is empty
  if (!fs.existsSync(destFolderPath)) {
    fs.mkdirSync(destFolderPath, { recursive: true });
  } else {
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
  
  // Update DB with local paths
  if (localPhotos.length > 0) {
    tour.image = localPhotos[0];
    tour.photos = localPhotos;
    copiedTours++;
  }
}

// Save DB
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`Successfully organized photos intelligently for ${copiedTours} tours.`);
