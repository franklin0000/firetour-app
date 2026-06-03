/**
 * fix_production_images.js
 * Overwrites the production database.json image paths to use /tours/mass/
 * which are bundled inside frontend/dist and served correctly in production.
 */
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.json');
let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Count images available locally
const massDir = path.join(__dirname, '../frontend/public/tours/mass');
const page2Dir = path.join(__dirname, '../frontend/public/tours/page2');

let massImages = [];
let page2Images = [];

try { massImages = fs.readdirSync(massDir).filter(f => f.endsWith('.jpg')); } catch(e) {}
try { page2Images = fs.readdirSync(page2Dir).filter(f => f.endsWith('.jpg')); } catch(e) {}

const allLocalImages = [
  ...massImages.map(f => `/tours/mass/${f}`),
  ...page2Images.map(f => `/tours/page2/${f}`)
];

console.log(`Found ${allLocalImages.length} local images available.`);
console.log(`Database has ${db.tours.length} tours.`);

// Fix each tour's image path
db.tours.forEach((tour, idx) => {
  const localIdx = idx % allLocalImages.length;
  tour.image = allLocalImages[localIdx];
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Done. All ${db.tours.length} tours now point to bundled local images.`);
console.log('Sample:', db.tours[0].image, '|', db.tours[5].image);
