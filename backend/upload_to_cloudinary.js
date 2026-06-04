/**
 * upload_to_cloudinary.js
 * Uploads ALL photos from Fotos_Excursiones_Punta_Cana to Cloudinary
 * organized by excursion, then updates database.json with real CDN URLs.
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Bypass local cert errors
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY    = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({ cloud_name: CLOUD_NAME, api_key: API_KEY, api_secret: API_SECRET });

const SRC_DIR  = path.join('C:', 'Users', 'bot', 'Desktop', 'Fotos_Excursiones_Punta_Cana');
const DB_PATH  = path.join(__dirname, 'database.json');

async function uploadImage(filePath, folder) {
  try {
    const publicId = `firetourdr/${folder}/${path.basename(filePath, path.extname(filePath))}`;
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      resource_type: 'image',
      overwrite: false,
      quality: 'auto:low', // Maximize speed
      fetch_format: 'auto',
    });
    return result.secure_url;
  } catch (err) {
    if (err.message && err.message.includes('already exists')) {
      const publicId = `firetourdr/${folder}/${path.basename(filePath, path.extname(filePath))}`;
      return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/q_auto,f_auto/${publicId}`;
    }
    return null;
  }
}

async function main() {
  console.log('🔥 Fire Tour DR — Cloudinary Mass Uploader (ALL PHOTOS)');
  
  let dbContent = fs.readFileSync(DB_PATH, 'utf8');
  if (dbContent.charCodeAt(0) === 0xFEFF) dbContent = dbContent.slice(1);
  const db = JSON.parse(dbContent);
  const excursionFolders = fs.readdirSync(SRC_DIR).filter(f => fs.statSync(path.join(SRC_DIR, f)).isDirectory()).sort();
  
  for (let i = 0; i < Math.min(excursionFolders.length, db.tours.length); i++) {
    const folder = excursionFolders[i];
    const tour = db.tours[i];
    const folderPath = path.join(SRC_DIR, folder);
    const cloudFolder = `tour_${tour.id}`;

    // Get ALL images
    const files = fs.readdirSync(folderPath)
      .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort()
      .map(f => path.join(folderPath, f));

    if (files.length === 0) continue;
    
    // Check if we already have the exact same number of photos in DB to skip (Resumes fast)
    if (tour.photos && tour.photos.length >= files.length && tour.photos[0].includes('cloudinary')) {
      console.log(`[${i+1}/${excursionFolders.length}] Skipping ${tour.name.substring(0,30)} (Already has ${tour.photos.length} photos)`);
      continue;
    }

    console.log(`[${i+1}/${excursionFolders.length}] Uploading ${files.length} photos for ${tour.name.substring(0,30)}...`);

    // Upload in parallel batches of 15
    const uploadedUrls = [];
    for (let j = 0; j < files.length; j += 15) {
      const batch = files.slice(j, j + 15);
      const results = await Promise.all(batch.map(file => uploadImage(file, cloudFolder)));
      uploadedUrls.push(...results.filter(Boolean));
    }

    if (uploadedUrls.length > 0) {
      tour.image = uploadedUrls[0];
      tour.photos = uploadedUrls;
    }

    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  }

  console.log('\n✅ UPLOAD COMPLETE! Database updated.');
}

main().catch(console.error);
