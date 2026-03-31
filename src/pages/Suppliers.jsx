import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Plus, X, Star } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Suppliers() {
  const { user } = useAuth()
  const [suppliers, setSuppliers] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', website: '', contact_email: '', notes: '', rating: 5 })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase.from('suppliers').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => setSuppliers(data || []))
  }, [user])

  const addSupplier = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { data, error } = await supabase.from('suppliers').insert({ ...form, rating: Number(form.rating), user_id: user.id }).select().single()
    if (error) toast.error('Failed to add supplier')
    else { setSuppliers(p => [data, ...p]); toast.success('Supplier added!'); setShowAdd(false) }
    setSaving(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-display font-bold">Suppliers</h1><p className="text-gray-400 text-sm mt-1">Manage your sourcing contacts</p></div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Supplier</button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map(s => (
          <div key={s.id} className="card">
            <div className="flex items-start justify-between">
              <div><h3 className="font-semibold text-white">{s.name}</h3>{s.website && <a href={s.website} target="_blank" rel="noreferrer" className="text-brand-400 text-xs hover:underline">{s.website}</a>}</div>
              <button onClick={async () => { await supabase.from('suppliers').delete().eq('id', s.id); setSuppliers(p => p.filter(x => x.id !== s.id)) }} className="text-gray-600 hover:text-red-400"><X size={14} /></button>
            </div>
            {s.contact_email && <p className="text-gray-400 text-sm mt-2">{s.contact_email}</p>}
            <div className="flex mt-2">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} className={i < s.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} />)}</div>
            {s.notes && <p className="text-gray-500 text-xs mt-2">{s.notes}</p>}
          </div>
        ))}
        {suppliers.length === 0 && <div className="card col-span-3 text-center py-8 text-gray-500">No suppliers yet. Add your first one!</div>}
      </div>
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-display font-bold">Add Supplier</h3><button onClick={() => setShowAdd(false)}><X size={20} className="text-gray-400" /></button></div>
            <form onSubmit={addSupplier} className="space-y-3">
              <div><label className="text-xs text-gray-400">Name</label><input className="input mt-1" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required /></div>
              <div><label className="text-xs text-gray-400">Website</label><input className="input mt-1" value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} /></div>
              <div><label className="text-xs text-gray-400">Contact Email</label><input className="input mt-1" type="email" value={form.contact_email} onChange={e => setForm(p => ({ ...p, contact_email: e.target.value }))} /></div>
              <div><label className="text-xs text-gray-400">Rating</label><select className="input mt-1" value={form.rating} onChange={e => setForm(p => ({ ...p, rating: e.target.value }))}>{[1,2,3,4,5].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}</select></div>
              <div><label className="text-xs text-gray-400">Notes</label><textarea className="input mt-1" rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
              <div className="flex gap-3"><button type="button" onClick={() => setShowAdd(false)} className="btn-secondary flex-1">Cancel</button><button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Add'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
