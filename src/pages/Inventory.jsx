import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Plus, X } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const PLATFORMS = ['eBay', 'Depop', 'Vinted', 'Facebook', 'StockX', 'GOAT', 'Other']
const STATUSES = ['unlisted', 'listed', 'sold', 'returned']
const STATUS_COLORS = { listed: 'text-brand-400 bg-brand-500/20', unlisted: 'text-gray-400 bg-white/10', sold: 'text-blue-400 bg-blue-500/20', returned: 'text-red-400 bg-red-500/20' }

export default function Inventory() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ item_name: '', sku: '', quantity: 1, cost_per_unit: '', listed_price: '', platform: 'eBay', status: 'unlisted', purchase_date: format(new Date(), 'yyyy-MM-dd'), notes: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase.from('inventory').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { setItems(data || []); setLoading(false) })
  }, [user])

  const addItem = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { data, error } = await supabase.from('inventory').insert({ ...form, quantity: Number(form.quantity), cost_per_unit: Number(form.cost_per_unit), listed_price: form.listed_price ? Number(form.listed_price) : null, user_id: user.id }).select().single()
    if (error) toast.error('Failed to add item')
    else { setItems(p => [data, ...p]); toast.success('Item added!'); setShowAdd(false) }
    setSaving(false)
  }

  const totalValue = items.reduce((a, i) => a + (Number(i.cost_per_unit) * Number(i.quantity)), 0)
  const listed = items.filter(i => i.status === 'listed').length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-display font-bold">Inventory</h1><p className="text-gray-400 text-sm mt-1">Manage your stock</p></div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Item</button>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="stat-card"><div className="text-xs text-gray-400 uppercase">Total Items</div><div className="text-2xl font-display font-bold text-white mt-1">{items.length}</div></div>
        <div className="stat-card"><div className="text-xs text-gray-400 uppercase">Listed</div><div className="text-2xl font-display font-bold text-brand-400 mt-1">{listed}</div></div>
        <div className="stat-card"><div className="text-xs text-gray-400 uppercase">Stock Value</div><div className="text-2xl font-display font-bold text-yellow-400 mt-1">£{totalValue.toFixed(2)}</div></div>
      </div>
      <div className="card"><div className="overflow-x-auto"><table className="w-full text-sm">
        <thead><tr className="text-gray-400 text-xs uppercase border-b border-white/5">{['Item','SKU','Qty','Cost','Listed Price','Platform','Status',''].map(h => <th key={h} className="text-left py-2 px-2">{h}</th>)}</tr></thead>
        <tbody>
          {loading ? <tr><td colSpan={8} className="text-center py-8 text-gray-500">Loading...</td></tr> :
           items.length === 0 ? <tr><td colSpan={8} className="text-center py-8 text-gray-500">No inventory yet.</td></tr> :
           items.map(i => (
            <tr key={i.id} className="border-b border-white/5 hover:bg-white/5">
              <td className="py-2 px-2 text-white">{i.item_name}</td>
              <td className="py-2 px-2 text-gray-400 text-xs">{i.sku || '-'}</td>
              <td className="py-2 px-2">{i.quantity}</td>
              <td className="py-2 px-2 text-yellow-400">£{Number(i.cost_per_unit).toFixed(2)}</td>
              <td className="py-2 px-2 text-gray-300">{i.listed_price ? `£${Number(i.listed_price).toFixed(2)}` : '-'}</td>
              <td className="py-2 px-2"><span className="px-2 py-0.5 rounded bg-white/10 text-xs">{i.platform}</span></td>
              <td className="py-2 px-2"><span className={clsx('px-2 py-0.5 rounded text-xs', STATUS_COLORS[i.status])}>{i.status}</span></td>
              <td className="py-2 px-2"><button onClick={async () => { await supabase.from('inventory').delete().eq('id', i.id); setItems(p => p.filter(x => x.id !== i.id)) }} className="text-gray-600 hover:text-red-400"><X size={14} /></button></td>
            </tr>
          ))}
        </tbody>
      </table></div></div>
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-lg">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-display font-bold">Add Inventory Item</h3><button onClick={() => setShowAdd(false)}><X size={20} className="text-gray-400" /></button></div>
            <form onSubmit={addItem} className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="text-xs text-gray-400">Item Name</label><input className="input mt-1" value={form.item_name} onChange={e => setForm(p => ({ ...p, item_name: e.target.value }))} required /></div>
              <div><label className="text-xs text-gray-400">SKU</label><input className="input mt-1" value={form.sku} onChange={e => setForm(p => ({ ...p, sku: e.target.value }))} /></div>
              <div><label className="text-xs text-gray-400">Quantity</label><input className="input mt-1" type="number" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} required /></div>
              <div><label className="text-xs text-gray-400">Cost/Unit (£)</label><input className="input mt-1" type="number" step="0.01" value={form.cost_per_unit} onChange={e => setForm(p => ({ ...p, cost_per_unit: e.target.value }))} required /></div>
              <div><label className="text-xs text-gray-400">Listed Price (£)</label><input className="input mt-1" type="number" step="0.01" value={form.listed_price} onChange={e => setForm(p => ({ ...p, listed_price: e.target.value }))} /></div>
              <div><label className="text-xs text-gray-400">Platform</label><select className="input mt-1" value={form.platform} onChange={e => setForm(p => ({ ...p, platform: e.target.value }))}>{PLATFORMS.map(p => <option key={p}>{p}</option>)}</select></div>
              <div><label className="text-xs text-gray-400">Status</label><select className="input mt-1" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></div>
              <div className="col-span-2"><label className="text-xs text-gray-400">Notes</label><input className="input mt-1" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
              <div className="col-span-2 flex gap-3"><button type="button" onClick={() => setShowAdd(false)} className="btn-secondary flex-1">Cancel</button><button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Add Item'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
