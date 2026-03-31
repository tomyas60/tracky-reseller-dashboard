# 📦 Tracky — Reseller Dashboard

A full-stack SaaS reseller dashboard with Stripe subscriptions, Supabase auth, and Netlify deployment.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Auth + DB**: Supabase
- **Payments**: Stripe
- **Deployment**: Netlify

## Setup

### 1. Clone & Install
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file (copy from `.env.example`):
```
VITE_SUPABASE_URL=https://evjvturahmionilohouj.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_STRIPE_PRICE_ID=price_...
```

### 3. Netlify Environment Variables
Add these in Netlify dashboard → Site settings → Environment variables:
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_STRIPE_PUBLISHABLE_KEY
VITE_STRIPE_PRICE_ID
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Stripe Setup
1. Create a product in Stripe dashboard
2. Create a recurring price (£14.99/month)
3. Copy the Price ID to `VITE_STRIPE_PRICE_ID`
4. Set webhook endpoint: `https://your-site.netlify.app/.netlify/functions/stripe-webhook`
5. Listen for: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

### 5. Deploy to Netlify
1. Connect this GitHub repo in Netlify
2. Set build command: `npm run build`
3. Set publish dir: `dist`
4. Add all environment variables
5. Deploy!

## Features
- 📈 Command Center with real-time stats
- 💰 Sales tracking across eBay, Depop, Vinted, StockX etc.
- 📦 Inventory management
- 🧧 Expense tracking
- 📉 Analytics with charts
- 🚚 Supplier database
- 🎯 Monthly goal tracking
- 🔒 Stripe subscription with webhook automation
- 🔐 Supabase Row Level Security on all data
