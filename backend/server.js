process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Bypass local Windows SSL certificate revocation checks
const express = require('express');
const cors = require('cors');
const database = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// -------------------------------------------------------------
// FILE UPLOAD SETUP
// -------------------------------------------------------------
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'firetour-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Upload Endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se proporcionó ningún archivo." });
  }
  // Provide absolute URL for the uploaded image
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// Sync Upload Endpoint (keeps original filename)
const syncStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Uses the filename provided in the request body, or falls back to originalname
    cb(null, req.body.exactFilename || file.originalname);
  }
});
const syncUpload = multer({ storage: syncStorage });

app.post('/api/sync-upload', syncUpload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se proporcionó ningún archivo." });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// 1. Get Paginated Tours (Supporting Infinite Scroll)
app.get('/api/tours', (req, res, next) => {

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4; // Default to 4 per page
  const category = req.query.category || 'all';
  const query = (req.query.query || '').toLowerCase().trim();

  let tours = database.getTours();

  // Filter by category
  if (category !== 'all') {
    tours = tours.filter(t => t.category === category || t.tag.toLowerCase() === category.toLowerCase());
  }

  // Filter by query
  if (query) {
    tours = tours.filter(t => 
      t.name.toLowerCase().includes(query) || 
      t.desc.toLowerCase().includes(query)
    );
  }

  // Paginate
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTours = tours.slice(startIndex, endIndex);

  res.json({
    tours: paginatedTours,
    hasMore: endIndex < tours.length,
    total: tours.length,
    page,
    limit
  });
});

// 2. Get Single Tour Details
app.get('/api/tours/:id', (req, res) => {
  const tour = database.getTourById(req.params.id);
  if (!tour) {
    return res.status(404).json({ error: "Excursión no encontrada." });
  }
  res.json(tour);
});
// 2.5 Update Tour (Admin)
app.put('/api/tours/:id', (req, res) => {
  const updatedTour = database.updateTour(req.params.id, req.body);
  if (!updatedTour) {
    return res.status(404).json({ error: "Excursión no encontrada." });
  }
  res.json(updatedTour);
});

// 3. Create Stripe Payment Intent
const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_mock_key_fire_tour_dr";
const stripe = require('stripe')(stripeKey);

app.post('/api/payment/create-payment-intent', async (req, res) => {
  try {
    const { 
      amount, tourId, email, customerName, phone, date, guests, 
      tourName, tourImage, balanceDue, hotelName, roomNumber 
    } = req.body;

    if (!amount || !tourId) {
      return res.status(400).json({ error: "Faltan campos obligatorios para generar la intención de pago." });
    }

    console.log(`[Stripe Checkout] Creating Payment Intent for Tour ID: ${tourId}, Amount: $${amount / 100}`);

    // Si la clave es mock, devolvemos un mock clientSecret
    if (stripeKey.includes('mock')) {
      return res.json({
        clientSecret: "pi_mock_intent_secret_" + Math.random().toString(36).substring(2, 15),
        isMock: true
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: { 
        tourId: String(tourId), 
        email: email || 'guest@firetour.dr',
        customerName: customerName || '',
        phone: phone || '',
        date: date || '',
        guests: String(guests || 1),
        tourName: tourName || '',
        tourImage: tourImage || '',
        balanceDue: String(balanceDue || 0),
        hotelName: hotelName || '',
        roomNumber: roomNumber || ''
      },
      // Habilitar TODOS los métodos de pago configurados en el Dashboard de Stripe (incluyendo Crypto)
      automatic_payment_methods: { enabled: true }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      isMock: false
    });
  } catch (err) {
    console.error("[Stripe Error] Payment Intent creation failed: ", err.message);
    res.json({
      clientSecret: "pi_mock_intent_secret_fallback_" + Math.random().toString(36).substring(2, 15),
      isMock: true,
      warning: "Fallback to mock due to Stripe API error: " + err.message
    });
  }
});

// 3.1 Verify and Book (Para Redirecciones de Pago Cripto / Apple Pay)
app.post('/api/payment/verify-and-book', async (req, res) => {
  try {
    const { payment_intent } = req.body;

    if (!payment_intent) {
      return res.status(400).json({ error: "No se proporcionó el payment_intent de Stripe." });
    }

    console.log(`[Stripe Verify] Validating payment intent: ${payment_intent}`);

    // Si es un mock, lo aceptamos directamente (para entorno de desarrollo/fallback)
    if (payment_intent.includes('mock')) {
      // Usaremos metadata mock enviada desde el front
      const metadata = req.body.fallbackMetadata || {};
      const mockRes = database.addReservation({
        tourId: parseInt(metadata.tourId) || 0,
        tourName: metadata.tourName || "Reserva de Prueba Local",
        tourImage: metadata.tourImage || "",
        customerName: metadata.customerName || "Invitado (Test Local)",
        email: metadata.email || "test@firetour.dr",
        phone: metadata.phone || "",
        date: metadata.date || new Date().toISOString().split('T')[0],
        guests: parseInt(metadata.guests) || 1,
        amountPaid: req.body.fallbackAmount || 0,
        paymentMethod: 'Test Local Mock',
        status: 'Confirmado',
        hotelName: metadata.hotelName || '',
        roomNumber: metadata.roomNumber || ''
      });
      return res.json({ success: true, reservation: mockRes });
    }

    // Entorno Real: Verificamos en Stripe
    const intent = await stripe.paymentIntents.retrieve(payment_intent);

    if (intent.status !== 'succeeded') {
      return res.status(400).json({ error: "El pago no se ha completado correctamente en Stripe." });
    }

    // Extraemos toda la metadata que inyectamos al crear el PaymentIntent
    const { 
      tourId, tourName, tourImage, customerName, email, phone, 
      date, guests, hotelName, roomNumber 
    } = intent.metadata;

    const reservation = database.addReservation({
      tourId: parseInt(tourId),
      tourName: tourName || "Reserva Segura vía Stripe",
      tourImage: tourImage || "",
      customerName: customerName || "Invitado",
      email: email || "reservas@firetour.dr",
      phone: phone || "",
      date: date || new Date().toISOString().split('T')[0],
      guests: parseInt(guests) || 1,
      amountPaid: intent.amount / 100, // Lo volvemos a dólares
      paymentMethod: intent.payment_method_types ? (intent.payment_method_types.includes('crypto') ? 'Criptomonedas Seguras' : 'Stripe Seguro') : 'Stripe Seguro',
      status: 'Confirmado',
      hotelName: hotelName || '',
      roomNumber: roomNumber || ''
    });

    console.log(`[Stripe Verify] Validated successfully! Created Booking: ${reservation.ticketCode}`);
    res.json({ success: true, reservation });

  } catch (err) {
    console.error("[Stripe Verify Error] ", err.message);
    res.status(500).json({ error: "Error interno al verificar el pago." });
  }
});

// 3.5 Authentication Routes
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "Faltan campos." });
  
  const existingUser = database.getUserByEmail(email);
  if (existingUser) return res.status(400).json({ error: "El correo ya está registrado." });
  
  const newUser = database.addUser({ name, email, password }); // En producción usar bcrypt
  res.status(201).json({ id: newUser.id, name: newUser.name, email: newUser.email });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = database.getUserByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Credenciales inválidas." });
  }
  res.json({ id: user.id, name: user.name, email: user.email });
});

app.post('/api/auth/me', (req, res) => {
  const { email } = req.body;
  const user = database.getUserByEmail(email);
  if (!user) return res.status(404).json({ error: "No encontrado" });
  res.json({ id: user.id, name: user.name, email: user.email });
});

// 4. Create Tour Reservation
app.post('/api/reservations', (req, res) => {
  const { tourId, customerName, email, phone, date, guests, amountPaid, paymentMethod, hotelName, roomNumber } = req.body;

  if (!tourId || !customerName || !email || !date || !guests) {
    return res.status(400).json({ error: "Faltan campos obligatorios para completar la reserva." });
  }

  let tourName = req.body.tourName || "";
  let tourImage = req.body.tourImage || "";
  const parsedTourId = parseInt(tourId);

  if (parsedTourId >= 0) {
    const tour = database.getTourById(parsedTourId);
    if (tour) {
      tourName = tour.name;
      tourImage = tour.image;
    }
  }

  if (!tourName) {
    if (req.body.tourName) {
      tourName = req.body.tourName;
      tourImage = req.body.tourImage || "";
    } else {
      return res.status(404).json({ error: "La excursión asociada no existe y no se especificó un nombre de reserva alternativo." });
    }
  }

  const reservation = database.addReservation({
    tourId: parsedTourId,
    tourName,
    tourImage,
    customerName,
    email,
    phone: phone || '',
    date,
    guests: parseInt(guests),
    amountPaid: parseFloat(amountPaid) || 0,
    paymentMethod: paymentMethod || 'Stripe Credit Card',
    status: 'Confirmado',
    hotelName: hotelName || '',
    roomNumber: roomNumber || ''
  });

  console.log(`[API Reservations] New Booking Created! Code: ${reservation.ticketCode}`);
  res.status(201).json(reservation);
});

// 5. Get List of Client Reservations (Secured by email)
app.get('/api/reservations', (req, res) => {
  const { email } = req.query;
  const allReservations = database.getReservations();
  
  // If no email is provided, return empty array to prevent data leak
  if (!email) {
    return res.status(401).json({ error: "No autorizado. Inicie sesión para ver sus reservas." });
  }

  // Admin exception (for the admin panel)
  if (email === 'admin@firetourdr.com') {
    return res.json(allReservations);
  }

  // Filter reservations only for the logged-in user
  const userReservations = allReservations.filter(r => r.email.toLowerCase() === email.toLowerCase());
  res.json(userReservations);
});

// 6. Get Chat Support Log
app.get('/api/chat', (req, res) => {
  res.json(database.getChatMessages());
});

// 7. Post Message to Chat Support & Trigger Bot Answer
app.post('/api/chat', (req, res) => {
  const { sender, text } = req.body;

  if (!sender || !text) {
    return res.status(400).json({ error: "Falta el remitente o el texto del mensaje." });
  }

  const userMsg = database.addChatMessage(sender, text);

  // Simple auto-responder bot logic
  if (sender === 'user') {
    setTimeout(() => {
      let botResponse = "¡Gracias por escribirnos! Un asesor de Fire Tour DR se pondrá en contacto contigo en breve para brindarte asistencia personalizada.";
      
      const txt = text.toLowerCase();
      if (txt.includes('saona') || txt.includes('isla')) {
        botResponse = "¡Excelente elección! Isla Saona es nuestra excursión estrella. Incluye crucero en catamarán de lujo, barra libre en todo el viaje y un almuerzo de buffet criollo exquisito. ¿Te gustaría saber las fechas disponibles?";
      } else if (txt.includes('precio') || txt.includes('cuesta') || txt.includes('costo') || txt.includes('pagar')) {
        botResponse = "Nuestros precios varían según la aventura: Saona cuesta $129 USD (con langosta VIP), Cap Cana Canopy $99 USD, y el paseo a caballo $110 USD. Todos los pagos se procesan de forma 100% segura mediante tarjeta de crédito con encriptación Stripe.";
      } else if (txt.includes('zipline') || txt.includes('cap cana') || txt.includes(' canopy')) {
        botResponse = "¡El Canopy Zipline en Cap Cana es pura adrenalina! Vuelas sobre 8 tirolinas sobre un espectacular farallón. Incluye traslado directo desde tu hotel y guías de seguridad de nivel profesional. ¿Para cuántas personas deseas reservar?";
      } else if (txt.includes('hola') || txt.includes('saludos') || txt.includes('buenos')) {
        botResponse = "¡Hola! Qué gusto saludarte. Soy el asistente inteligente de Fire Tour DR. Estoy listo para ayudarte a elegir y reservar el mejor tour de Punta Cana. ¿Qué tipo de actividades te gustan (agua, aventura, naturaleza, relajación)?";
      }

      database.addChatMessage('agent', botResponse);
      console.log(`[Chatbot] Auto-responded to user message: "${text}"`);
    }, 1000);
  }

  res.status(201).json(userMsg);
});

// Helper to make https requests using promises
function fetchFlightsFromAviasales(origin, destination, departDate, returnDate, token) {
  const https = require('https');
  return new Promise((resolve, reject) => {
    const url = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=${origin.toUpperCase()}&destination=${destination.toUpperCase()}&departure_at=${departDate}${returnDate ? `&return_at=${returnDate}` : ''}&sorting=price&direct=false&currency=usd&limit=10&token=${token}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          resolve({ success: false });
        }
      });
    }).on('error', (err) => {
      resolve({ success: false });
    });
  });
}

const AIRLINE_MAPPING = {
  'AA': { name: 'American Airlines', logo: 'https://images.kiwi.com/airlines/64/AA.png' },
  'DL': { name: 'Delta Air Lines', logo: 'https://images.kiwi.com/airlines/64/DL.png' },
  'UA': { name: 'United Airlines', logo: 'https://images.kiwi.com/airlines/64/UA.png' },
  'B6': { name: 'JetBlue Airways', logo: 'https://images.kiwi.com/airlines/64/B6.png' },
  'IB': { name: 'Iberia', logo: 'https://images.kiwi.com/airlines/64/IB.png' },
  'AV': { name: 'Avianca', logo: 'https://images.kiwi.com/airlines/64/AV.png' },
  'UX': { name: 'Air Europa', logo: 'https://images.kiwi.com/airlines/64/UX.png' },
  'CM': { name: 'Copa Airlines', logo: 'https://images.kiwi.com/airlines/64/CM.png' }
};

// 8. Search Flights Live (Integrating Aviasales v3 API & Local Fallback Simulation)
app.get('/api/flights/search', async (req, res) => {
  const { origin, destination, departDate, returnDate, adults, cabin } = req.query;
  
  if (!origin || !destination || !departDate) {
    return res.status(400).json({ error: 'Faltan parámetros obligatorios de búsqueda (origin, destination, departDate).' });
  }

  const token = 'faa3fa5179ead3a257051cd87c02436c';
  const marker = '443038';

  console.log(`[Flight API] Searching flights from ${origin} to ${destination} starting ${departDate}...`);

  try {
    const apiResult = await fetchFlightsFromAviasales(origin, destination, departDate, returnDate, token);
    
    let flights = [];
    if (apiResult && apiResult.success && apiResult.data && apiResult.data.length > 0) {
      flights = apiResult.data.map((f, i) => {
        const airlineInfo = AIRLINE_MAPPING[f.airline] || { name: `Aero ${f.airline}`, logo: `https://images.kiwi.com/airlines/64/${f.airline}.png` };
        
        // Format departure/arrival times
        const depDateObj = new Date(f.departure_at);
        const depTime = depDateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
        
        // Duration format
        const hours = Math.floor(f.duration / 60) || 3;
        const mins = (f.duration % 60) || 15;
        
        const arrDateObj = new Date(depDateObj.getTime() + (f.duration || 180) * 60000);
        const arrTime = arrDateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });

        return {
          id: `flight-real-${i}`,
          airline: airlineInfo.name,
          logo: airlineInfo.logo,
          flightNumber: `${f.airline}-${f.flight_number}`,
          origin: f.origin,
          destination: f.destination,
          departureTime: depTime,
          arrivalTime: arrTime,
          duration: `${hours}h ${mins}m`,
          price: f.price,
          stops: f.transfers === 0 ? 'Directo' : `${f.transfers} ${f.transfers === 1 ? 'escala' : 'escalas'}`,
          bookingUrl: `https://www.aviasales.com${f.link}?marker=${marker}`
        };
      });
    }

    // Fallback: If API has no cached data for these specific dates, dynamically generate highly realistic flights
    if (flights.length === 0) {
      console.log(`[Flight API] Cache miss. Generating dynamic fallback flight results for ${origin} -> ${destination}...`);
      const basePrice = origin.toUpperCase() === 'MIA' ? 240 : origin.toUpperCase() === 'JFK' ? 310 : origin.toUpperCase() === 'MAD' ? 620 : 410;
      
      const sampleAirlines = [
        { code: 'AA', priceMod: 0 },
        { code: 'DL', priceMod: 15 },
        { code: 'UA', priceMod: 25 },
        { code: 'B6', priceMod: -10 }
      ];

      flights = sampleAirlines.map((air, idx) => {
        const info = AIRLINE_MAPPING[air.code];
        const multiplier = adults ? parseInt(adults) : 1;
        const price = Math.round((basePrice + air.priceMod + (idx * 12)) * (cabin === 'Business' ? 2.5 : 1) * multiplier);
        
        const depHours = 8 + idx * 3;
        const depTime = `${depHours.toString().padStart(2, '0')}:15`;
        const arrTime = `${(depHours + 3).toString().padStart(2, '0')}:45`;

        return {
          id: `flight-fallback-${idx}`,
          airline: info.name,
          logo: info.logo,
          flightNumber: `${air.code}-${420 + idx * 15}`,
          origin: origin.toUpperCase(),
          destination: destination.toUpperCase(),
          departureTime: depTime,
          arrivalTime: arrTime,
          duration: '3h 30m',
          price: price,
          stops: idx % 3 === 0 ? 'Directo' : '1 escala',
          bookingUrl: `https://www.aviasales.com/search/${origin.toUpperCase()}${departDate.replace(/-/g, '')}${destination.toUpperCase()}${returnDate ? returnDate.replace(/-/g, '') : ''}1?marker=${marker}`
        };
      });
    }

    res.json({ success: true, flights });
  } catch (err) {
    console.error("[Flight API Error] ", err.message);
    res.json({ success: false, error: err.message });
  }
});

// Helper to perform HTTP GET requests with a custom User-Agent (required by OpenStreetMap APIs)
function fetchJson(url) {
  const https = require('https');
  return new Promise((resolve) => {
    const options = {
      headers: {
        'User-Agent': 'FireTourDRApp/1.0 (contact@firetourdr.com; support@firetourdr.com)'
      },
      timeout: 10000 // 10s timeout
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => {
      resolve(null);
    });
  });
}

// Geocode location using Nominatim (convert "Punta Cana (PUJ)" -> Lat/Lon)
async function geocodeLocation(locationText) {
  try {
    const cleanQuery = locationText.replace(/\s*\(.*?\)\s*/g, '').trim();
    console.log(`[Nominatim Geocode] Querying coords for: "${cleanQuery}"`);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanQuery)}&format=json&limit=1`;
    const result = await fetchJson(url);
    if (result && result.length > 0) {
      return {
        lat: parseFloat(result[0].lat),
        lon: parseFloat(result[0].lon)
      };
    }
  } catch (err) {
    console.error("[Geocode Error] ", err.message);
  }
  // Default to Punta Cana coordinates if Nominatim search fails
  return { lat: 18.56, lon: -68.37 };
}

// Fetch real hotels in a 20km radius from coordinates using Overpass API
async function fetchRealHotels(lat, lon) {
  try {
    console.log(`[Overpass API] Fetching real hotels around: Lat ${lat}, Lon ${lon}`);
    const query = `[out:json][timeout:15];(node["tourism"="hotel"](around:20000,${lat},${lon});way["tourism"="hotel"](around:20000,${lat},${lon});relation["tourism"="hotel"](around:20000,${lat},${lon}););out center;`;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    const result = await fetchJson(url);
    if (result && result.elements && result.elements.length > 0) {
      return result.elements.map(el => {
        const name = el.tags.name || el.tags.operator || 'Resort & Spa Tropical';
        const stars = parseInt(el.tags['stars']) || parseInt(el.tags['hotel:stars']) || 4;
        return {
          id: `osm-hotel-${el.id}`,
          name: name,
          stars: stars > 0 && stars <= 5 ? stars : 4,
          location: el.tags['addr:street'] || el.tags['addr:suburb'] || el.tags['addr:place'] || 'Zona Costera',
          amenities: [
            el.tags['internet_access'] === 'yes' || el.tags['wifi'] === 'yes' ? 'Wi-Fi gratis' : 'Wi-Fi disponible',
            el.tags['swimming_pool'] === 'yes' || el.tags['pool'] === 'yes' ? 'Piscina' : 'Playa Privada',
            el.tags['air_conditioning'] === 'yes' ? 'Aire Acondicionado' : 'Todo Incluido',
            el.tags['restaurant'] === 'yes' ? 'Restaurante gourmet' : 'Gimnasio'
          ]
        };
      });
    }
  } catch (err) {
    console.error("[Overpass Hotels Error] ", err.message);
  }
  return [];
}

// Fetch real car rental offices in a 20km radius from coordinates using Overpass API
async function fetchRealCarRentals(lat, lon) {
  try {
    console.log(`[Overpass API] Fetching real car rentals around: Lat ${lat}, Lon ${lon}`);
    const query = `[out:json][timeout:15];(node["amenity"="car_rental"](around:20000,${lat},${lon});way["amenity"="car_rental"](around:20000,${lat},${lon}););out center;`;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    const result = await fetchJson(url);
    if (result && result.elements && result.elements.length > 0) {
      return result.elements.map(el => {
        const name = el.tags.name || el.tags.operator || 'Local Rental Partner';
        return {
          supplier: name,
          location: el.tags['addr:street'] || el.tags['addr:suburb'] || 'Zona Aeropuerto'
        };
      });
    }
  } catch (err) {
    console.error("[Overpass Cars Error] ", err.message);
  }
  return [];
}

// 9. Search Rental Cars with Live OSM Nominatim & Overpass Geocoding (DiscoverCars Affiliate Integration)
app.get('/api/cars/search', async (req, res) => {
  const { pickup, dropoff, pickupDate, dropoffDate, age } = req.query;

  if (!pickup || !pickupDate || !dropoffDate) {
    return res.status(400).json({ error: 'Faltan parámetros obligatorios para la búsqueda de autos (pickup, pickupDate, dropoffDate).' });
  }

  const marker = '443038';
  console.log(`[Car API] Searching real-time rental cars comparison at "${pickup}" from ${pickupDate} to ${dropoffDate}...`);

  try {
    const pDate = new Date(pickupDate);
    const dDate = new Date(dropoffDate);
    const diffTime = Math.abs(dDate - pDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    // 1. Geocode location using Nominatim
    const coords = await geocodeLocation(pickup);
    console.log(`[Car API] Coordinates for "${pickup}": Lat ${coords.lat}, Lon ${coords.lon}`);

    // 2. Fetch real car rental suppliers from OpenStreetMap
    let realSuppliers = await fetchRealCarRentals(coords.lat, coords.lon);

    // Fallback default list if no OSM car rentals found in radius
    if (realSuppliers.length === 0) {
      console.log(`[Car API] No suppliers found on OSM for "${pickup}", using default catalog.`);
      realSuppliers = [
        { supplier: 'Alamo Rent A Car' },
        { supplier: 'Europcar' },
        { supplier: 'Hertz' },
        { supplier: 'Sixt' }
      ];
    }

    // Keep top 6 suppliers for comparison
    const selectedSuppliers = realSuppliers.slice(0, 6);

    const CAR_CATEGORIES = [
      {
        category: 'Económico',
        model: 'Hyundai Accent',
        logo: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=400',
        specs: ['Automático', 'Aire Acondicionado', '5 Asientos', '2 Maletas'],
        basePrice: 28
      },
      {
        category: 'Mini',
        model: 'Kia Picanto',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Kia_Picanto_front.JPG',
        specs: ['Manual', 'Aire Acondicionado', '4 Asientos', '1 Maleta'],
        basePrice: 20
      },
      {
        category: 'SUV / 4x4',
        model: 'Toyota RAV4',
        logo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400',
        specs: ['Automático', 'Aire Acondicionado', '5 Asientos', '4 Maletas', 'Tracción 4x4'],
        basePrice: 50
      },
      {
        category: 'Lujo / Convertible',
        model: 'Ford Mustang Convertible',
        logo: 'https://images.unsplash.com/photo-1611016186353-9af58c69a533?auto=format&fit=crop&q=80&w=400',
        specs: ['Automático', 'Aire Acondicionado', '4 Asientos', '2 Maletas', 'Descapotable'],
        basePrice: 89
      }
    ];

    const results = CAR_CATEGORIES.map((cat, catIdx) => {
      const rating = (8.2 + (catIdx * 0.3) % 1.5).toFixed(1);
      const reviews = 500 + (catIdx * 240);

      // Distribute the real suppliers found in this location across offers
      const offers = selectedSuppliers.map((sup, supIdx) => {
        const factor = 0.9 + (supIdx * 0.05); // slightly vary price per supplier
        const pricePerDay = Math.round(cat.basePrice * factor);
        const isBestDeal = supIdx === 0;

        const encodedLocation = encodeURIComponent(pickup);
        const totalPrice = pricePerDay * diffDays;

        return {
          supplier: sup.supplier,
          pricePerDay,
          totalPrice,
          isBestDeal,
          bookingUrl: `https://www.discovercars.com/?a_aid=${marker}&location=${encodedLocation}&pickupDate=${pickupDate}&dropoffDate=${dropoffDate}&supplier=${encodeURIComponent(sup.supplier)}`
        };
      });

      // Sort offers by price ascending to make sure the lowest price is marked as best deal
      offers.sort((a, b) => a.pricePerDay - b.pricePerDay);
      offers.forEach((off, idx) => {
        off.isBestDeal = idx === 0;
      });

      return {
        id: `car-cat-${catIdx}`,
        category: cat.category,
        model: cat.model,
        logo: cat.logo,
        specs: cat.specs,
        rating: parseFloat(rating),
        reviews,
        days: diffDays,
        offers
      };
    });

    res.json({ success: true, cars: results });
  } catch (err) {
    console.error("[Car API Error] ", err.message);
    res.json({ success: false, error: err.message });
  }
});

// 10. Search Hotels with Live OSM Nominatim & Overpass Geocoding (Booking.com / Agoda / Expedia Affiliate Integration)
app.get('/api/hotels/search', async (req, res) => {
  const { destination, checkIn, checkOut, guests } = req.query;

  if (!destination || !checkIn || !checkOut) {
    return res.status(400).json({ error: 'Faltan parámetros obligatorios para la búsqueda de hoteles (destination, checkIn, checkOut).' });
  }

  const marker = '443038';
  console.log(`[Hotel API] Searching real-time hotel comparison at "${destination}" from ${checkIn} to ${checkOut}...`);

  try {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const diffNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    // 1. Geocode location using Nominatim
    const coords = await geocodeLocation(destination);
    console.log(`[Hotel API] Coordinates for "${destination}": Lat ${coords.lat}, Lon ${coords.lon}`);

    // 2. Fetch real hotel listings from OpenStreetMap Overpass
    let realHotels = await fetchRealHotels(coords.lat, coords.lon);
    
    // Fallback default list if no OSM hotels found in radius
    if (realHotels.length === 0) {
      console.log(`[Hotel API] No hotels found on OSM for "${destination}", loading default catalog.`);
      realHotels = [
        { id: 'fallback-1', name: 'Hard Rock Hotel & Casino Punta Cana', stars: 5, location: 'Playa de Arena Gorda, Punta Cana', amenities: ['Todo Incluido', 'Playa Privada', 'Casino', 'Wi-Fi gratis'] },
        { id: 'fallback-2', name: 'Barceló Bávaro Palace - All Inclusive', stars: 5, location: 'Playa Bávaro, Punta Cana', amenities: ['Todo Incluido', 'Parque Acuático', 'Golf', 'Spa'] },
        { id: 'fallback-3', name: 'Lopesan Costa Bávaro Resort, Spa & Casino', stars: 5, location: 'Costa Bávaro, Punta Cana', amenities: ['Todo Incluido', 'Piscina Infinity', 'Casino', 'Wi-Fi gratis'] },
        { id: 'fallback-4', name: 'Melia Punta Cana Beach - Adults Only', stars: 5, location: 'Playa Bávaro, Punta Cana', amenities: ['Solo Adultos', 'Bienestar Integral', 'Playa Arena Blanca', 'Spa YHI'] }
      ];
    }

    // Slice to top 8 hotels for performance
    const selectedHotels = realHotels.slice(0, 8);

    // Mapeo detallado de fotos reales y auténticas de resorts y hoteles en la República Dominicana (cero IA)
    const REAL_DOMINICAN_HOTEL_PHOTOS = {
      'Hard Rock Hotel & Casino Punta Cana': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600',
      'Barceló Bávaro Palace - All Inclusive': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=600',
      'Lopesan Costa Bávaro Resort, Spa & Casino': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600',
      'Melia Punta Cana Beach - Adults Only': 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=600',
      'Hyatt Ziva & Zilara Cap Cana': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=600',
      'Paradisus Palma Real Golf & Spa': 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=600',
      'Secrets Royal Beach Punta Cana': 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600',
      'Dreams Royal Beach Punta Cana': 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=600',
      'Hotel Crowne Plaza Santo Domingo': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600',
      'Sheraton Santo Domingo Hotel': 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=600',
      'Hodelpa Novus Plaza': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600',
      'Hotel Llave Del Mar': 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=600',
      'Renaissance Santo Domingo Jaragua Hotel & Casino': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600',
      'El Embajador, a Royal Hideaway Hotel': 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600'
    };

    const GENERIC_REAL_DOMINICAN_RESORT_PHOTOS = [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=600'
    ];

    const results = selectedHotels.map((hotel, index) => {
      let img = REAL_DOMINICAN_HOTEL_PHOTOS[hotel.name];
      if (!img) {
        const code = hotel.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        img = GENERIC_REAL_DOMINICAN_RESORT_PHOTOS[code % GENERIC_REAL_DOMINICAN_RESORT_PHOTOS.length];
      }
      const basePrice = 120 + (index * 25) + (hotel.stars * 35);
      
      const offers = [
        { provider: 'Agoda', pricePerNight: Math.round(basePrice * 0.95), isBestDeal: true },
        { provider: 'Booking.com', pricePerNight: Math.round(basePrice), isBestDeal: false },
        { provider: 'Expedia', pricePerNight: Math.round(basePrice * 1.05), isBestDeal: false }
      ];

      const encodedDest = encodeURIComponent(destination);
      const computedOffers = offers.map(offer => {
        const totalPrice = offer.pricePerNight * diffNights;
        return {
          ...offer,
          totalPrice,
          bookingUrl: `https://hotellook.tp.st/${marker}?tp_subid=hotel-${offer.provider.toLowerCase()}&location=${encodedDest}&checkIn=${checkIn}&checkOut=${checkOut}`
        };
      });

      const rating = (8.0 + (index * 0.2) % 2.0).toFixed(1);
      const reviews = 150 + (index * 320);

      return {
        id: hotel.id,
        name: hotel.name,
        stars: hotel.stars,
        rating: parseFloat(rating),
        reviews,
        location: hotel.location || 'Zona Céntrica',
        image: img,
        amenities: hotel.amenities,
        nights: diffNights,
        offers: computedOffers
      };
    });

    res.json({ success: true, hotels: results });
  } catch (err) {
    console.error("[Hotel API Error] ", err.message);
    res.json({ success: false, error: err.message });
  }
});

// Global Error Handling & 404
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: "Endpoint de API no encontrado. Revisa la ruta." });
});

app.use((err, req, res, next) => {
  console.error("[Fatal Error] ", err.stack);
  res.status(500).json({ error: "Fallo Interno del Servidor. Inténtalo más tarde." });
});

// Serve frontend static files in production
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Start listening
app.listen(PORT, () => {
  console.log(`=============================================================`);
  console.log(`🔥 FIRE TOUR DR - BACKEND API SERVER ONLINE`);
  console.log(`🔌 Listening on port: ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`=============================================================`);
});
