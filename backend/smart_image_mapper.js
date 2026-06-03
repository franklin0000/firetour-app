/**
 * smart_image_mapper.js
 * Assigns contextually matching, high-quality Unsplash images
 * to each of the 184 tours based on their activity type.
 * These are permanent URLs that never expire.
 */
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.json');
let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// ============================================================
// CURATED PHOTO POOLS BY ACTIVITY TYPE
// Source: Unsplash (free, permanent, no hotlink restrictions)
// ============================================================

const PHOTO_POOLS = {

  atv_buggy: [
    'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80',
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'https://images.unsplash.com/photo-1625728571757-c62e3cf3eb90?w=800&q=80',
    'https://images.unsplash.com/photo-1605170439002-90845e8c0137?w=800&q=80',
    'https://images.unsplash.com/photo-1527430253228-e93688616381?w=800&q=80',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80',
    'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=800&q=80',
  ],

  zipline: [
    'https://images.unsplash.com/photo-1525183995014-bd94c0750cd5?w=800&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'https://images.unsplash.com/photo-1504700610630-ac6aba3536d3?w=800&q=80',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80',
    'https://images.unsplash.com/photo-1551524163-5ded75283f50?w=800&q=80',
    'https://images.unsplash.com/photo-1582593465273-68ef3b2b2893?w=800&q=80',
  ],

  horseback: [
    'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80',
    'https://images.unsplash.com/photo-1548396824-3990de0b1c77?w=800&q=80',
    'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&q=80',
    'https://images.unsplash.com/photo-1461039126842-7cfab2e46b56?w=800&q=80',
    'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800&q=80',
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80',
  ],

  catamaran_boat: [
    'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80',
    'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=800&q=80',
    'https://images.unsplash.com/photo-1580508174046-170816f65662?w=800&q=80',
    'https://images.unsplash.com/photo-1525543907767-4a2e78e4c2ad?w=800&q=80',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800&q=80',
  ],

  saona_island: [
    'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    'https://images.unsplash.com/photo-1490122417551-6ee9691429d0?w=800&q=80',
    'https://images.unsplash.com/photo-1485470733090-0081b94d4c48?w=800&q=80',
    'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800&q=80',
  ],

  snorkel_diving: [
    'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&q=80',
    'https://images.unsplash.com/photo-1560275619-4cc5fa59d3ae?w=800&q=80',
    'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80',
    'https://images.unsplash.com/photo-1437622368342-7a3d73a13368?w=800&q=80',
    'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80',
    'https://images.unsplash.com/photo-1477120128765-a0528148fed6?w=800&q=80',
  ],

  fishing: [
    'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800&q=80',
    'https://images.unsplash.com/photo-1520402133761-9193ac305cfa?w=800&q=80',
    'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80',
    'https://images.unsplash.com/photo-1415716750798-28bc8927b04c?w=800&q=80',
    'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800&q=80',
  ],

  party_boat: [
    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80',
    'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?w=800&q=80',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
    'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&q=80',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
  ],

  transfer: [
    'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80',
    'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800&q=80',
    'https://images.unsplash.com/photo-1495638822934-5c5a2e2de9c8?w=800&q=80',
    'https://images.unsplash.com/photo-1555664378-27b669e31e3c?w=800&q=80',
  ],

  nature_park: [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800&q=80',
    'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&q=80',
    'https://images.unsplash.com/photo-1417325384643-aac51acc9e5d?w=800&q=80',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
  ],

  beach: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
    'https://images.unsplash.com/photo-1551949489-cc01ddbf38c1?w=800&q=80',
    'https://images.unsplash.com/photo-1533760881669-80db4d7b341d?w=800&q=80',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&q=80',
    'https://images.unsplash.com/photo-1468413253076-e9a99882c2f8?w=800&q=80',
  ],

  adventure_combo: [
    'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&q=80',
    'https://images.unsplash.com/photo-1540206395-68808572332f?w=800&q=80',
    'https://images.unsplash.com/photo-1544161513-0179fe746fd5?w=800&q=80',
    'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80',
    'https://images.unsplash.com/photo-1496080174650-637e3f22fa03?w=800&q=80',
    'https://images.unsplash.com/photo-1606185540834-d0e7c5b4adca?w=800&q=80',
  ],
};

// Counters per category for round-robin rotation
const counters = {};
function getNext(pool_key) {
  if (!counters[pool_key]) counters[pool_key] = 0;
  const pool = PHOTO_POOLS[pool_key];
  const url = pool[counters[pool_key] % pool.length];
  counters[pool_key]++;
  return url;
}

// Smart classifier
function classifyTour(name) {
  const n = name.toLowerCase();

  // Specific keywords first (most specific → least specific)
  if (n.includes('saona') || n.includes('isla saona') || n.includes('island')) return 'saona_island';
  if (n.includes('snorkel') || n.includes('diving') || n.includes('scuba') || n.includes('reef')) return 'snorkel_diving';
  if (n.includes('fishing') || n.includes('pesca')) return 'fishing';
  if (n.includes('party boat') || n.includes('hip hop') || n.includes('open bar') || n.includes('disco')) return 'party_boat';
  if (n.includes('catamaran') || n.includes('cruise') || n.includes('boat tour') || n.includes('yacht')) return 'catamaran_boat';
  if (n.includes('zipline') || n.includes('zip line') || n.includes('canopy') || n.includes('tirolina')) return 'zipline';
  if (n.includes('horseback') || n.includes('horse') || n.includes('caballo')) return 'horseback';
  if (n.includes('atv') || n.includes('buggy') || n.includes('quad') || n.includes('4x4') || n.includes('off-road') || n.includes('safari')) return 'atv_buggy';
  if (n.includes('transfer') || n.includes('airport') || n.includes('transport') || n.includes('pickup') || n.includes('shuttle')) return 'transfer';
  if (n.includes('national park') || n.includes('haitises') || n.includes('redonda') || n.includes('monkey') || n.includes('zoo') || n.includes('nature')) return 'nature_park';
  if (n.includes('beach') || n.includes('macao') || n.includes('bavaro') || n.includes('playa')) return 'beach';
  if (n.includes('activities') || n.includes('combo') || n.includes('all in') || n.includes('complete') || n.includes('full day')) return 'adventure_combo';

  // Fallback by tag
  return 'adventure_combo';
}

// Apply smart mapping
let counts = {};
db.tours.forEach(tour => {
  const category = classifyTour(tour.name);
  tour.image = getNext(category);
  counts[category] = (counts[category] || 0) + 1;
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log('=== Smart Image Mapping Complete ===');
console.log('Tours by category:');
Object.entries(counts).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(`  ${k}: ${v} tours`));
console.log('\nSamples:');
db.tours.slice(0,5).forEach(t => console.log(`  [${t.id}] ${t.name.slice(0,45)}... → ${t.image.split('?')[0].split('/').pop()}`));
