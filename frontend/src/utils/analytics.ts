// Fire Tour DR - Analytics & Ad Pixel Integration Engine
// Compatible with Meta Pixel (Facebook & Instagram), TikTok Ads, and Google Ads

declare global {
  interface Window {
    fbq?: any;
    ttq?: any;
    gtag?: any;
    dataLayer?: any[];
  }
}

export const trackPageView = (pageName?: string) => {
  try {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
    if (typeof window.ttq?.page === 'function') {
      window.ttq.page();
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_title: pageName || document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
      });
    }
  } catch (e) {
    console.debug('[Analytics] PageView dispatch skipped', e);
  }
};

export const trackViewContent = (tour: { id: number | string; name: string; price: number }) => {
  try {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'ViewContent', {
        content_ids: [String(tour.id)],
        content_name: tour.name,
        content_type: 'product',
        value: tour.price,
        currency: 'USD'
      });
    }
    if (typeof window.ttq?.track === 'function') {
      window.ttq.track('ViewContent', {
        contents: [{
          content_id: String(tour.id),
          content_name: tour.name,
          price: tour.price
        }],
        value: tour.price,
        currency: 'USD'
      });
    }
  } catch (e) {
    console.debug('[Analytics] ViewContent dispatch skipped', e);
  }
};

export const trackInitiateCheckout = (data: { tourName: string; tourId: number | string; totalPrice: number; guests: number }) => {
  try {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'InitiateCheckout', {
        content_name: data.tourName,
        content_ids: [String(data.tourId)],
        value: data.totalPrice,
        currency: 'USD',
        num_items: data.guests
      });
    }
    if (typeof window.ttq?.track === 'function') {
      window.ttq.track('InitiateCheckout', {
        content_id: String(data.tourId),
        content_name: data.tourName,
        value: data.totalPrice,
        currency: 'USD',
        quantity: data.guests
      });
    }
  } catch (e) {
    console.debug('[Analytics] InitiateCheckout dispatch skipped', e);
  }
};

export const trackPurchase = (order: { id: string; amount: number; currency?: string; tourName: string }) => {
  try {
    const currency = order.currency || 'USD';
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Purchase', {
        content_name: order.tourName,
        value: order.amount,
        currency: currency,
        order_id: order.id
      });
    }
    if (typeof window.ttq?.track === 'function') {
      window.ttq.track('CompletePayment', {
        content_name: order.tourName,
        value: order.amount,
        currency: currency,
        order_id: order.id
      });
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'purchase', {
        transaction_id: order.id,
        value: order.amount,
        currency: currency,
        items: [{ item_name: order.tourName, price: order.amount }]
      });
    }
  } catch (e) {
    console.debug('[Analytics] Purchase dispatch skipped', e);
  }
};
