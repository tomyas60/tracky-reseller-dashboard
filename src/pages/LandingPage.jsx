import { Link } from 'react-router-dom'
import { BarChart3, Package, Receipt, Truck, TrendingUp, ShieldCheck, Zap, ArrowRight, Check } from 'lucide-react'

const features = [
  { icon: BarChart3, title: 'Command Center Dashboard', desc: 'See your revenue, profit, ROI, and tax estimate at a glance. Real-time data, zero guesswork.' },
  { icon: TrendingUp, title: 'Sales Tracking & Analytics', desc: 'Log every sale across eBay, Depop, Vinted, StockX and more. Visualise your growth month-by-month.' },
  { icon: Package, title: 'Inventory Management', desc: 'Know exactly what you have, what\'s listed, and what it cost. Never oversell or forget an item again.' },
  { icon: Receipt, title: 'Expense Tracking', desc: 'Track packaging, fees, shipping, and recurring costs. See your true net profit after all expenses.' },
  { icon: Truck, title: 'Supplier Database', desc: 'Store all your sourcing contacts, websites, and ratings in one organised place.' },
  { icon: ShieldCheck, title: 'Secure & Private', desc: 'Your data is fully isolated with row-level security. Nobody else can see your numbers.' },
]

const testimonials = [
  { name: 'Jordan M.', role: 'Full-time reseller', text: 'I went from manually tracking in Excel to having a full command centre. Tracky paid for itself in the first week.' },
  { name: 'Aisha T.', role: 'Sneaker flipper', text: 'The platform breakdown is insane. I had no idea 70% of my profit was coming from Vinted until I saw the pie chart.' },
  { name: 'Ben K.', role: 'Side-hustle reseller', text: "The monthly goals feature keeps me motivated. I actually hit my targets now because I can see exactly where I'm at." },
]

const PRICE = '£14.99'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050810] text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050810]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📦</span>
            <span className="font-display font-bold text-xl tracking-tight">TRACKY</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">Sign In</Link>
            <Link to="/signup" className="btn-primary text-sm py-2 px-4">Start Free Trial</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-brand-500/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 text-sm text-brand-400 mb-6">
            <Zap size={14} className="fill-brand-400" /> The #1 dashboard for serious resellers
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-extrabold leading-[1.05] mb-6">
            Run Your Reselling<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-300">Like a Business</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Tracky gives you a real-time command centre for your reselling operation — track sales, manage inventory, analyse your platforms, and hit your monthly goals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="btn-primary text-base py-3.5 px-8 flex items-center gap-2">
              Get Started — {PRICE}/mo <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary text-base py-3.5 px-8">Sign In</Link>
          </div>
          <p className="text-gray-500 text-sm mt-5">No long-term contracts. Cancel anytime.</p>
        </div>

        {/* Dashboard mockup */}
        <div className="relative max-w-5xl mx-auto mt-16">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050810] z-10 pointer-events-none" style={{ top: '60%' }} />
          <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-brand-500/10">
            <div className="bg-[#070d1a] border-b border-white/5 px-6 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-500 text-xs ml-3 font-medium">Tracky — Command Center</span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                {[['Revenue', '£8,420', 'text-yellow-400'],['Profit', '£3,190', 'text-brand-400'],['After Exp.', '£2,840', 'text-purple-400'],['Est. Tax', '£638', 'text-yellow-500'],['Sales', '47', 'text-blue-400'],['Avg ROI', '+42%', 'text-brand-400']].map(([l,v,c]) => (
                  <div key={l} className="bg-white/5 rounded-xl p-3">
                    <div className="text-xs text-gray-500 mb-1">{l}</div>
                    <div className={`text-sm font-display font-bold ${c}`}>{v}</div>
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-xs text-gray-400 mb-3 uppercase tracking-wide">Monthly Goals</div>
                  {[['Revenue', 84],['Profit', 92],['Sales Count', 67]].map(([l,p]) => (
                    <div key={l} className="mb-2">
                      <div className="flex justify-between text-xs text-gray-400 mb-1"><span>{l}</span><span>{p}%</span></div>
                      <div className="h-1.5 bg-white/10 rounded-full"><div className="h-1.5 bg-brand-500 rounded-full" style={{ width: `${p}%` }} /></div>
                    </div>
                  ))}
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-xs text-gray-400 mb-3 uppercase tracking-wide">Recent Sales</div>
                  {[['Nike Dunk Low','eBay','+£87'],['Supreme Tee','Depop','+£43'],['PS5 Controller','Facebook','+£32']].map(([item,plat,profit]) => (
                    <div key={item} className="flex items-center justify-between text-xs mb-2">
                      <span className="text-gray-300">{item}</span>
                      <span className="text-gray-500">{plat}</span>
                      <span className="text-brand-400 font-semibold">{profit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-display font-bold mb-4">Everything You Need to Scale</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Built specifically for resellers. No bloat, no spreadsheets — just the tools that move the needle.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card hover:border-brand-500/30 transition-all duration-300 group">
                <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-500/20 transition-colors">
                  <Icon size={20} className="text-brand-400" />
                </div>
                <h3 className="font-display font-semibold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-20 px-4 sm:px-6 bg-[#070d1a]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-12">Resellers Love Tracky</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map(({ name, role, text }) => (
              <div key={name} className="card">
                <div className="flex mb-3">{Array.from({ length: 5 }).map((_, i) => <span key={i} className="text-yellow-400 text-sm">★</span>)}</div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">"{text}"</p>
                <div><p className="text-white font-semibold text-sm">{name}</p><p className="text-gray-500 text-xs">{role}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4 sm:px-6" id="pricing">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-4xl font-display font-bold mb-4">One Plan. Everything Included.</h2>
          <p className="text-gray-400 mb-10">No tiers, no upsells. Just one powerful plan that covers everything.</p>
          <div className="card border-brand-500/40 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-bold px-4 py-1 rounded-full">MOST POPULAR</div>
            <div className="pt-4">
              <h3 className="text-xl font-display font-bold mb-1">Tracky Pro</h3>
              <div className="text-5xl font-display font-extrabold text-brand-400 my-4">{PRICE}<span className="text-lg text-gray-400 font-normal">/mo</span></div>
              <ul className="space-y-3 text-left mb-8">
                {['Command Center Dashboard','Sales & ROI Tracking','Inventory Management','Expense Tracking','Supplier Database','Platform Analytics & Charts','Monthly Goal Tracking','7-Day Revenue Trend','CSV Data Export','Secure & Private Data'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-300">
                    <Check size={16} className="text-brand-400 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="btn-primary w-full text-center block py-3.5 text-base">Get Started Now</Link>
              <p className="text-gray-500 text-xs mt-3">Secure checkout via Stripe. Cancel anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-display font-bold mb-4">Ready to Treat Your Reselling Like a Real Business?</h2>
          <p className="text-gray-400 mb-8 text-lg">Join hundreds of resellers already using Tracky to maximise their profits.</p>
          <Link to="/signup" className="btn-primary text-base py-3.5 px-10 inline-flex items-center gap-2">
            Start Now — {PRICE}/mo <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-xl">📦</span>
          <span className="font-display font-bold">TRACKY</span>
        </div>
        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Tracky. All rights reserved.</p>
        <div className="flex items-center justify-center gap-6 mt-3">
          <Link to="/login" className="text-gray-500 hover:text-gray-300 text-sm">Sign In</Link>
          <Link to="/signup" className="text-gray-500 hover:text-gray-300 text-sm">Sign Up</Link>
        </div>
      </footer>
    </div>
  )
}
