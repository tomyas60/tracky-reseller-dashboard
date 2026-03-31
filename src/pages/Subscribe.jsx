import { useState } from 'react'
import { Link } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export default function Subscribe() {
  const { user, isSubscribed } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    if (!user) { window.location.href = '/signup'; return }
    setLoading(true)
    try {
      const stripe = await stripePromise
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email, priceId: import.meta.env.VITE_STRIPE_PRICE_ID })
      })
      const { sessionId, error } = await response.json()
      if (error) throw new Error(error)
      await stripe.redirectToCheckout({ sessionId })
    } catch (err) {
      toast.error('Failed to start checkout. Please try again.')
      setLoading(false)
    }
  }

  if (isSubscribed) return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      <div className="card text-center max-w-md w-full">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-display font-bold">You're all set!</h2>
        <p className="text-gray-400 mt-2">Your subscription is active.</p>
        <Link to="/dashboard" className="btn-primary mt-6 inline-block">Go to Dashboard</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-display font-bold text-white">
            <span className="text-3xl">📦</span> TRACKY
          </Link>
          <h1 className="text-2xl font-display font-bold text-white mt-6">Choose Your Plan</h1>
        </div>
        <div className="card border-brand-500/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-display font-bold">Tracky Pro</h3>
              <p className="text-gray-400 text-sm mt-1">Everything you need to scale your reselling</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-display font-bold text-brand-400">£14.99</div>
              <div className="text-gray-400 text-sm">/month</div>
            </div>
          </div>
          <ul className="space-y-3 mb-6">
            {['Command Center Dashboard','Sales Tracking & Analytics','Inventory Management','Expense Tracking','Supplier Database','Platform P&L Reports','7-Day Trend Charts','Monthly Goal Tracking','CSV Export'].map(f => (
              <li key={f} className="flex items-center gap-3 text-sm text-gray-300">
                <span className="text-brand-400 text-base">✓</span> {f}
              </li>
            ))}
          </ul>
          <button onClick={handleSubscribe} disabled={loading} className="btn-primary w-full text-base py-3">
            {loading ? 'Redirecting to Stripe...' : 'Start Subscription — £14.99/mo'}
          </button>
          <p className="text-center text-gray-500 text-xs mt-3">Cancel anytime. Powered by Stripe.</p>
        </div>
        <p className="text-center text-gray-500 text-sm mt-4">
          Already subscribed? <Link to="/login" className="text-brand-400">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
