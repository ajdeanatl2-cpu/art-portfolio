// netlify/functions/create-checkout.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    // We receive the priceId and the type (prints/apparel) directly from the frontend
    const { priceId, productType } = JSON.parse(event.body);

    if (!priceId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing Price ID' }) };
    }

    // Basic Configuration
    const sessionConfig = {
      mode: 'payment',
      line_items: [
        { price: priceId, quantity: 1 }
      ],
      // This automatically uses your site URL for the redirect
      success_url: `${event.headers.origin}/?status=success`, 
      cancel_url: `${event.headers.origin}/?status=cancel`
    };

    // --- SHIPPING LOGIC ---
    // Only add shipping options if the product type is 'prints'
    if (productType === 'prints') {
      sessionConfig.shipping_address_collection = { allowed_countries: ['US'] };
      
      sessionConfig.shipping_options = [
        // 1. YOUR STANDARD SHIPPING ($12)
        // Go to Stripe > Products > Shipping Rates > Copy the ID (starts with shr_)
        { shipping_rate: 'shr_1SvOjiDt4JcRGZdOGiRNvCU6' }, 

        // 2. YOUR LOCAL PICKUP ($0)
        // Go to Stripe > Products > Shipping Rates > Copy the ID (starts with shr_)
        { shipping_rate: 'shr_1SvOl0Dt4JcRGZdOJYaklzfh' } 
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };
  } catch (err) {
    console.error("Stripe Error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};