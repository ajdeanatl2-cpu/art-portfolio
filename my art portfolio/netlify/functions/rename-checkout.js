// netlify/functions/create-checkout.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Map product IDs to Stripe price IDs
const products = {
  1: { priceId: 'price_YOUR_PRINT_PRICE_ID', type: 'prints' },
  2: { priceId: 'price_YOUR_OTHER_PRICE_ID', type: 'apparel' },
  3: { priceId: 'price_YOUR_HAT_PRICE_ID', type: 'apparel' }
};

exports.handler = async (event) => {
  try {
    const { productId } = JSON.parse(event.body);
    const product = products[productId];

    if (!product) {
      return { statusCode: 400, body: 'Invalid product' };
    }

    const sessionConfig = {
      mode: 'payment',
      line_items: [
        { price: product.priceId, quantity: 1 }
      ],
      success_url: 'https://yourdomain.com/success',
      cancel_url: 'https://yourdomain.com/cancel'
    };

    // Only add shipping for prints
    if (product.type === 'prints') {
      sessionConfig.shipping_address_collection = { allowed_countries: ['US'] };
      sessionConfig.shipping_options = [
        { shipping_rate: 'shr_STANDARD' },     // replace with your Stripe shipping rate ID
        { shipping_rate: 'shr_LOCAL_PICKUP' } // replace with your local pickup shipping rate ID
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify(err.message) };
  }
};