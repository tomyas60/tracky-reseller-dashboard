import { useState } from 'react'
import { useSales } from '../hooks/useSales'
import { useAuth } from '../contexts/AuthContext'
import { TrendingUp, DollarSign, ShoppingBag, Percent, Plus, X } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format, subDays } from 'date-fns'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const PLATFORMS = ['eBay', 'Depop', 'Vinted', 'Facebook', 'StockX', 'GOAT', 'Other']
const CATEGORIES = ['Trainers', 'Clothing', 'Electronics', 'Collectibles', 'Books', 'Other']

const filters = ['7D', 'MTD', 'YTD', 'ALL']

export default function Dashboard() {
  const { profile } = useAuth()
  const [filter, setFilter] = useState('MTD')
  const { sales, loading, fetchSales, addSale, deleteSale, stats } = useSales()
  const [showAddSale, setShowAddSale] = useState(false)
  const [form, setForm] = useState({ date: format(new Date(), 'yyyy-MM-dd'), platform: 'eBay', category: 'Trainers', item_name: '', price: '', cost: '', fees: '', notes: '' })
  const [saving, setSaving] = useState(false)

  const revenueGoal = 5000
  const profitGoal = 2000
  const salesGoal = 30

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = format(subDays(new Date(), 6 - i), 'MMM d')
    const dateStr = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd')
    const daySales = sales.filter(s => s.date === dateStr)
    return { date: d, revenue: daySales.reduce((a, s) => a + Number(s.price), 0), profit: daySales.reduce((a, s) => a + Number(s.profit), 0) }
  })

  const handleAddSale = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await addSale({ ...form, price: Number(form.price), cost: Number(form.cost), fees: Number(form.fees) })
    if (error) toast.error('Failed to add sale')
    else { toast.success('Sale added!'); setShowAddSale(false); setForm({ date: format(new Date(), 'yyyy-MM-dd'), platform: 'eBay', category: 'Trainers', item_name: '', price: '', cost: '', fees: '', notes: '' }) }
    setSaving(false)
  }

  const fmt = (n) => `£${Number(n).toFixed(2)}`

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Command Center</h1>
          <p className="text-gray-400 text-sm mt-1">Your complete reselling operations hub</p>
        </div>
        <button onClick={() => setShowAddSale(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Sale
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[{ label: 'Revenue', value: fmt(stats.revenue), icon: DollarSign, color: 'text-yellow-400' },
          { label: 'Profit', value: fmt(stats.profit), icon: TrendingUp, color: 'text-brand-400' },
          { label: 'After Expenses', value: fmt(stats.profit), icon: DollarSign, color: 'text-purple-400' },
          { label: 'Est. Tax (20%)', value: fmt(stats.profit * 0.2), icon: Percent, color: 'text-yellow-500' },
          { label: 'Sales', value: stats.count, icon: ShoppingBag, color: 'text-blue-400' },
          { label: 'Avg ROI', value: `+${stats.avgRoi.toFixed(1)}%`, icon: TrendingUp, color: 'text-brand-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
              <Icon size={14} className="text-gray-500" />
            </div>
            <div className={`text-xl font-display font-bold ${color} mt-1`}>{value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {/* Goals */}
        <div className="card lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Monthly Goals Progress</h3>
          <div className="grid grid-cols-3 gap-4">
            {[{ label: 'Revenue', current: stats.revenue, goal: revenueGoal, fmt: true },
              { label: 'Profit', current: stats.profit, goal: profitGoal, fmt: true },
              { label: 'Sales Count', current: stats.count, goal: salesGoal, fmt: false }].map(({ label, current, goal, fmt: isFmt }) => {
              const pct = Math.min((current / goal) * 100, 100)
              return (
                <div key={label}>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{label}</span>
                    <span>{isFmt ? fmt(current) : current} / {isFmt ? fmt(goal) : goal}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full"><div className="h-2 bg-brand-500 rounded-full transition-all" style={{ width: `${pct}%` }} /></div>
                  <div className="text-xs text-gray-500 mt-1">{pct.toFixed(0)}%</div>
                </div>
              )
            })}
          </div>
        </div>
        {/* 7-day trend */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">7-Day Trend</h3>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip contentStyle={{ background: '#0d1b2a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} formatter={(v) => [`£${v.toFixed(2)}`]} />
              <Area type="monotone" dataKey="profit" stroke="#22c55e" fill="url(#profitGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters + Sales table */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {filters.map(f => (
            <button key={f} onClick={() => { setFilter(f); fetchSales(f) }} className={clsx('px-3 py-1 rounded-lg text-sm font-medium transition-all', filter === f ? 'bg-brand-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20')}>{f}</button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-white/5">
                {['Date','Platform','Item','Price','Cost','Fees','Profit','ROI',''].map(h => <th key={h} className="text-left py-2 px-2">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="text-center py-8 text-gray-500">Loading...</td></tr>
              ) : sales.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-8 text-gray-500">No sales found. Hit "Add Sale" to get started!</td></tr>
              ) : sales.map(s => (
                <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-2 px-2 text-gray-300">{s.date}</td>
                  <td className="py-2 px-2"><span className="px-2 py-0.5 rounded-md bg-white/10 text-xs">{s.platform}</span></td>
                  <td className="py-2 px-2 text-gray-300 max-w-[120px] truncate">{s.item_name || '-'}</td>
                  <td className="py-2 px-2 text-yellow-400">{fmt(s.price)}</td>
                  <td className="py-2 px-2 text-gray-300">{fmt(s.cost)}</td>
                  <td className="py-2 px-2 text-gray-300">{fmt(s.fees)}</td>
                  <td className={clsx('py-2 px-2 font-semibold', Number(s.profit) >= 0 ? 'text-brand-400' : 'text-red-400')}>{fmt(s.profit)}</td>
                  <td className={clsx('py-2 px-2 text-sm', Number(s.roi) >= 0 ? 'text-brand-400' : 'text-red-400')}>{Number(s.roi).toFixed(1)}%</td>
                  <td className="py-2 px-2"><button onClick={() => deleteSale(s.id)} className="text-gray-600 hover:text-red-400 transition-colors"><X size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Sale Modal */}
      {showAddSale && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display font-bold">Add Sale</h3>
              <button onClick={() => setShowAddSale(false)}><X size={20} className="text-gray-400 hover:text-white" /></button>
            </div>
            <form onSubmit={handleAddSale} className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="text-xs text-gray-400">Item Name</label><input className="input mt-1" value={form.item_name} onChange={e => setForm(p => ({ ...p, item_name: e.target.value }))} placeholder="Nike Air Max 95..." /></div>
              <div><label className="text-xs text-gray-400">Date</label><input className="input mt-1" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required /></div>
              <div><label className="text-xs text-gray-400">Platform</label><select className="input mt-1" value={form.platform} onChange={e => setForm(p => ({ ...p, platform: e.target.value }))}>{PLATFORMS.map(p => <option key={p}>{p}</option>)}</select></div>
              <div><label className="text-xs text-gray-400">Category</label><select className="input mt-1" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
              <div><label className="text-xs text-gray-400">Sale Price (£)</label><input className="input mt-1" type="number" step="0.01" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} required /></div>
              <div><label className="text-xs text-gray-400">Cost (£)</label><input className="input mt-1" type="number" step="0.01" value={form.cost} onChange={e => setForm(p => ({ ...p, cost: e.target.value }))} required /></div>
              <div><label className="text-xs text-gray-400">Fees (£)</label><input className="input mt-1" type="number" step="0.01" value={form.fees} onChange={e => setForm(p => ({ ...p, fees: e.target.value }))} required /></div>
              <div className="col-span-2"><label className="text-xs text-gray-400">Notes</label><input className="input mt-1" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Optional..." /></div>
              <div className="col-span-2 flex gap-3 mt-2">
                <button type="button" onClick={() => setShowAddSale(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Add Sale'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
