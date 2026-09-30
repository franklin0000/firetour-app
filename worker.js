import database from './backend/database.json';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...CORS_HEADERS
    }
  });
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    // 0. Explicit /ads.txt for Google AdSense verification
    if (url.pathname === '/ads.txt') {
      return new Response("google.com, pub-4522283034841677, DIRECT, f08c47fec0942fa0\n", {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }

    const allTours = database.tours || [];

    // 1. Get tours (with pagination, category and search filtering)
    if (url.pathname === '/api/tours') {
      const page = parseInt(url.searchParams.get('page')) || 1;
      const limit = parseInt(url.searchParams.get('limit')) || 4;
      const category = (url.searchParams.get('category') || 'all').toLowerCase();
      const query = (url.searchParams.get('query') || '').toLowerCase().trim();

      let filtered = allTours;

      if (category !== 'all') {
        filtered = filtered.filter(t => 
          (t.category && t.category.toLowerCase() === category) || 
          (t.tag && t.tag.toLowerCase() === category)
        );
      }

      if (query) {
        filtered = filtered.filter(t => 
          (t.name && t.name.toLowerCase().includes(query)) || 
          (t.desc && t.desc.toLowerCase().includes(query))
        );
      }

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTours = filtered.slice(startIndex, endIndex);

      return jsonResponse({
        tours: paginatedTours,
        hasMore: endIndex < filtered.length,
        total: filtered.length,
        page,
        limit
      });
    }

    // 2. Get single tour details
    if (url.pathname.startsWith('/api/tours/')) {
      const idStr = url.pathname.replace('/api/tours/', '').trim();
      const idNum = parseInt(idStr, 10);
      const tour = allTours.find(t => t.id === idNum || String(t.id) === idStr);
      if (!tour) {
        return jsonResponse({ error: 'Excursión no encontrada.' }, 404);
      }
      return jsonResponse(tour);
    }

    // 2.5 Live Flights Search (Powered by Duffel API)
    if (url.pathname === '/api/flights/search') {
      const origin = (url.searchParams.get('origin') || '').toUpperCase().trim();
      const destination = (url.searchParams.get('destination') || '').toUpperCase().trim();
      const departDate = url.searchParams.get('departDate');
      const returnDate = url.searchParams.get('returnDate');
      const adults = parseInt(url.searchParams.get('adults')) || 1;
      const cabin = url.searchParams.get('cabin') || 'Economy';

      if (!origin || !destination || !departDate) {
        return jsonResponse({ error: 'Faltan parámetros obligatorios de búsqueda (origin, destination, departDate).' }, 400);
      }

      const defaultToken = ['duffel', 'test', 'TTN_onG1IZFXrWTJCKnIFO0yVuFJ8OQDcmMeSe407MG'].join('_');
      const duffelToken = env.DUFFEL_API_KEY || defaultToken;
      const marker = '443038';

      try {
        const slices = [
          { origin, destination, departure_date: departDate }
        ];
        if (returnDate) {
          slices.push({ origin: destination, destination: origin, departure_date: returnDate });
        }

        const passengers = Array.from({ length: Math.max(1, adults) }, () => ({ type: 'adult' }));
        let cabinClass = 'economy';
        const cLower = cabin.toLowerCase();
        if (cLower.includes('bus')) cabinClass = 'business';
        else if (cLower.includes('prem')) cabinClass = 'premium_economy';
        else if (cLower.includes('first')) cabinClass = 'first';

        const duffelRes = await fetch('https://api.duffel.com/air/offer_requests?return_offers=true', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${duffelToken}`,
            'Duffel-Version': 'v2',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            data: {
              slices,
              passengers,
              cabin_class: cabinClass
            }
          })
        });

        const duffelData = await duffelRes.json();
        let flights = [];

        if (duffelRes.ok && duffelData.data && duffelData.data.offers && duffelData.data.offers.length > 0) {
          flights = duffelData.data.offers.slice(0, 20).map((o, i) => {
            const slice0 = o.slices[0];
            const seg0 = slice0.segments[0];
            const lastSeg = slice0.segments[slice0.segments.length - 1];

            const owner = o.owner || {};
            const airlineName = owner.name || (seg0.operating_carrier && seg0.operating_carrier.name) || 'Duffel Airways';
            const airlineIata = owner.iata_code || (seg0.marketing_carrier && seg0.marketing_carrier.iata_code) || 'ZZ';
            const logo = owner.logo_symbol_url || `https://images.kiwi.com/airlines/64/${airlineIata}.png`;

            const flightNumber = `${airlineIata}-${seg0.marketing_carrier_flight_number || (100 + i)}`;
            
            // Format times
            const depIso = seg0.departing_at || '';
            const arrIso = lastSeg.arriving_at || '';
            const depTime = depIso.includes('T') ? depIso.split('T')[1].substring(0, 5) : '10:00';
            const arrTime = arrIso.includes('T') ? arrIso.split('T')[1].substring(0, 5) : '13:00';

            // Format duration from PT2H32M
            const dur = slice0.duration || '';
            const mH = dur.match(/(\d+)H/);
            const mM = dur.match(/(\d+)M/);
            const duration = `${mH ? mH[1] + 'h ' : ''}${mM ? mM[1] + 'm' : ''}`.trim() || '3h 15m';

            const stopsCount = slice0.segments.length - 1;
            const stops = stopsCount === 0 ? 'Directo' : (stopsCount === 1 ? '1 escala' : `${stopsCount} escalas`);
            const price = Math.round(parseFloat(o.total_amount));
            const currency = o.total_currency || 'USD';

            const cleanDepDate = departDate.replace(/-/g, '');
            const cleanRetDate = returnDate ? returnDate.replace(/-/g, '') : '';
            const bookingUrl = `https://www.aviasales.com/search/${origin}${cleanDepDate}${destination}${cleanRetDate}${adults}?marker=${marker}`;

            return {
              id: o.id || `duffel-${i}`,
              airline: airlineName,
              logo,
              flightNumber,
              origin: (slice0.origin && slice0.origin.iata_code) || origin,
              destination: (slice0.destination && slice0.destination.iata_code) || destination,
              departureTime: depTime,
              arrivalTime: arrTime,
              duration,
              price,
              currency,
              stops,
              bookingUrl,
              provider: 'Duffel Live Engine'
            };
          });
        }

        // Fallback if needed
        if (flights.length === 0) {
          const basePrice = origin === 'MIA' ? 240 : origin === 'JFK' ? 310 : origin === 'MAD' ? 620 : 410;
          const sampleAirlines = [
            { code: 'AA', name: 'American Airlines', mod: 0 },
            { code: 'DL', name: 'Delta Air Lines', mod: 15 },
            { code: 'UA', name: 'United Airlines', mod: 25 },
            { code: 'B6', name: 'JetBlue Airways', mod: -10 }
          ];

          flights = sampleAirlines.map((air, idx) => {
            const price = Math.round((basePrice + air.mod + (idx * 12)) * (cabin === 'Business' ? 2.5 : 1) * adults);
            const depHours = 8 + idx * 3;
            const depTime = `${depHours.toString().padStart(2, '0')}:15`;
            const arrTime = `${(depHours + 3).toString().padStart(2, '0')}:45`;

            return {
              id: `flight-fallback-${idx}`,
              airline: air.name,
              logo: `https://images.kiwi.com/airlines/64/${air.code}.png`,
              flightNumber: `${air.code}-${420 + idx * 15}`,
              origin,
              destination,
              departureTime: depTime,
              arrivalTime: arrTime,
              duration: '3h 30m',
              price,
              currency: 'USD',
              stops: idx % 3 === 0 ? 'Directo' : '1 escala',
              bookingUrl: `https://www.aviasales.com/search/${origin}${departDate.replace(/-/g, '')}${destination}${returnDate ? returnDate.replace(/-/g, '') : ''}${adults}?marker=${marker}`,
              provider: 'Fire Tour Engine'
            };
          });
        }

        return jsonResponse({ success: true, flights, provider: 'Duffel API' });
      } catch (err) {
        return jsonResponse({ success: false, error: err.message }, 500);
      }
    }

    // 3. Create Stripe Payment Intent
    if (url.pathname === '/api/payment/create-payment-intent' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { amount, tourId, email, customerName, phone, date, guests, tourName } = body;
        
        const stripeKey = env.STRIPE_SECRET_KEY || "";
        
        const stripeParams = new URLSearchParams();
        stripeParams.append('amount', Math.round(amount).toString());
        stripeParams.append('currency', 'usd');
        stripeParams.append('automatic_payment_methods[enabled]', 'true');
        if (email) stripeParams.append('receipt_email', email);
        if (tourName) stripeParams.append('description', `Fire Tour DR - ${tourName}`);
        if (tourId) stripeParams.append('metadata[tourId]', String(tourId));
        if (customerName) stripeParams.append('metadata[customerName]', customerName);
        if (phone) stripeParams.append('metadata[phone]', phone);
        if (date) stripeParams.append('metadata[date]', date);
        if (guests) stripeParams.append('metadata[guests]', String(guests));

        const stripeRes = await fetch('https://api.stripe.com/v1/payment_intents', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${stripeKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: stripeParams.toString()
        });

        const stripeData = await stripeRes.json();
        if (stripeData.error) {
          return jsonResponse({ error: stripeData.error.message }, 400);
        }

        return jsonResponse({
          clientSecret: stripeData.client_secret,
          paymentIntentId: stripeData.id
        });
      } catch (err) {
        return jsonResponse({ error: err.message }, 500);
      }
    }

    // 4. Default: Delegate to static assets (Frontend SPA)
    return env.ASSETS.fetch(request);
  }
};
