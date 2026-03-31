const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { userId, email, priceId } = JSON.parse(event.body)

    // Create or retrieve customer
    const customers = await stripe.customers.list({ email, limit: 1 })
    let customer
    if (customers.data.length > 0) {
      customer = customers.data[0]
    } else {
      customer = await stripe.customers.create({ email, metadata: { supabase_uid: userId } })
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.URL}/dashboard?subscription=success`,
      cancel_url: `${process.env.URL}/subscribe?canceled=true`,
      metadata: { supabase_uid: userId },
    })

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: session.id }),
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    }
  }
}
