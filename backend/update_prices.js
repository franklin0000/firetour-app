const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');

const getMarketPrice = (name) => {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('scape park')) return 129;
  if (lowerName.includes('coco bongo')) return 85;
  if (lowerName.includes('dolphin') || lowerName.includes('delfin')) return 110;
  if (lowerName.includes('samana') || lowerName.includes('bacardi')) return 135;
  if (lowerName.includes('santo domingo')) return 95;
  if (lowerName.includes('saona')) return 85;
  if (lowerName.includes('catalina')) return 85;
  if (lowerName.includes('monkey')) return 75;
  if (lowerName.includes('zipline') || lowerName.includes('tirolina') || lowerName.includes('canopy')) return 80;
  if (lowerName.includes('catamaran') || lowerName.includes('party boat') || lowerName.includes('snorkel')) return 75;
  if (lowerName.includes('buggy') || lowerName.includes('buggies') || lowerName.includes('atv') || lowerName.includes('polaris') || lowerName.includes('four wheel')) return 65;
  if (lowerName.includes('safari') || lowerName.includes('countryside') || lowerName.includes('campo')) return 65;
  if (lowerName.includes('horse') || lowerName.includes('caballo') || lowerName.includes('cabalgata')) return 65;
  if (lowerName.includes('boat') || lowerName.includes('yate') || lowerName.includes('lancha')) return 80;
  if (lowerName.includes('hoyo azul')) return 90;
  
  // Default price (random between 65 and 120, rounded to nearest 5)
  const base = Math.floor(Math.random() * 12) * 5 + 65; // 65, 70, 75... 120
  return base;
};

const updatePrices = () => {
  if (!fs.existsSync(DB_FILE)) {
    console.error("No database.json found!");
    return;
  }

  const raw = fs.readFileSync(DB_FILE, 'utf8');
  let data = JSON.parse(raw);

  let updatedCount = 0;

  data.tours = data.tours.map(tour => {
    const marketPrice = getMarketPrice(tour.name);
    if (tour.price !== marketPrice) {
      updatedCount++;
    }
    return {
      ...tour,
      price: marketPrice
    };
  });

  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Successfully updated the market prices for ${updatedCount} tours out of ${data.tours.length}.`);
};

updatePrices();
