/**
 * assign_real_photos.js
 * Assigns the actual photos from _Tours desktop folder to each tour in the database.
 * Tours with real photos get foto_1.jpg from their matching folder.
 * Remaining tours keep the Unsplash contextual images.
 */
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.json');
let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const realPhotoBase = path.join(__dirname, '../frontend/public/tours/real');

// Map: tour folder number -> local web path for foto_1.jpg
const realPhotos = {};
if (fs.existsSync(realPhotoBase)) {
  fs.readdirSync(realPhotoBase).forEach(folder => {
    const match = folder.match(/^tour_(\d+)$/);
    if (match) {
      const num = parseInt(match[1]);
      const folderPath = path.join(realPhotoBase, folder);
      const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.jpg')).sort();
      if (files.length > 0) {
        realPhotos[num] = `/tours/real/${folder}/${files[0]}`;
      }
    }
  });
}

console.log(`Found real photos for tour IDs: ${Object.keys(realPhotos).join(', ')}`);

// The _Tours folder uses IDs 2-24 but our DB tours are sorted alphabetically by name.
// We need to match by tour name keywords instead of ID.
// Build a keyword map from folder names to photo paths.

const keywordMap = {
  'parasailing':    realPhotos[2],
  'saona':          realPhotos[3],
  'transfer':       realPhotos[4],
  'aeropuerto':     realPhotos[4],
  'airport':        realPhotos[4],
  'buggy':          realPhotos[5],
  'atv':            realPhotos[5],
  'quad':           realPhotos[5],
  'catamaran':      realPhotos[7],
  'snorkel':        realPhotos[7],
  'crucero':        realPhotos[7],
  'party boat':     realPhotos[13],
  'hip hop':        realPhotos[13],
  'horseback':      realPhotos[14],
  'horse':          realPhotos[14],
  'caballo':        realPhotos[14],
  'coco bongo':     realPhotos[15],
  'santo domingo':  realPhotos[19],
  'colonial':       realPhotos[19],
  'safari':         realPhotos[24],
  'zipline':        realPhotos[5],  // Buggy folder has zipline combo shots too
  'zip line':       realPhotos[5],
};

let assigned = 0;
let kept = 0;

db.tours.forEach(tour => {
  const name = tour.name.toLowerCase();
  let matched = null;

  for (const [keyword, photoPath] of Object.entries(keywordMap)) {
    if (photoPath && name.includes(keyword)) {
      matched = photoPath;
      break;
    }
  }

  if (matched) {
    tour.image = matched;
    assigned++;
  } else {
    kept++;
  }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`\n=== Assignment Complete ===`);
console.log(`Tours assigned real photos: ${assigned}`);
console.log(`Tours kept contextual Unsplash images: ${kept}`);
console.log(`\nSample assignments:`);
db.tours.slice(0, 8).forEach(t => {
  console.log(`  ${t.name.slice(0, 50)}`);
  console.log(`  -> ${t.image}`);
});
