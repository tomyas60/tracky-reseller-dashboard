const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature']
  let stripeEvent

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return { statusCode: 400, body: `Webhook Error: ${err.message}` }
  }

  const session = stripeEvent.data.object

  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const userId = session.metadata?.supabase_uid
      const subscriptionId = session.subscription
      if (userId) {
        await supabase.from('profiles').update({
          subscription_status: 'active',
          subscription_id: subscriptionId,
          stripe_customer_id: session.customer,
          plan: 'pro',
        }).eq('id', userId)
      }
      break
    }
    case 'customer.subscription.updated': {
      const sub = stripeEvent.data.object
      const customers = await stripe.customers.retrieve(sub.customer)
      const userId = customers.metadata?.supabase_uid
      if (userId) {
        await supabase.from('profiles').update({
          subscription_status: sub.status,
          subscription_id: sub.id,
        }).eq('id', userId)
      }
      break
    }
    case 'customer.subscription.deleted': {
      const sub = stripeEvent.data.object
      const customer = await stripe.customers.retrieve(sub.customer)
      const userId = customer.metadata?.supabase_uid
      if (userId) {
        await supabase.from('profiles').update({
          subscription_status: 'canceled',
          plan: 'free',
        }).eq('id', userId)
      }
      break
    }
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) }
}
