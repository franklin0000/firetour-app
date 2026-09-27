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
