import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Plus, X } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const CATS = ['Packaging','Shipping','Software','Storage','Advertising','Fees','Travel','Other']

export default function Expenses() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ date: format(new Date(), 'yyyy-MM-dd'), category: 'Packaging', description: '', amount: '', recurring: false })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase.from('expenses').select('*').eq('user_id', user.id).order('date', { ascending: false })
      .then(({ data }) => { setExpenses(data || []); setLoading(false) })
  }, [user])

  const addExpense = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { data, error } = await supabase.from('expenses').insert({ ...form, amount: Number(form.amount), user_id: user.id }).select().single()
    if (error) toast.error('Failed to add expense')
    else { setExpenses(p => [data, ...p]); toast.success('Expense added!'); setShowAdd(false) }
    setSaving(false)
  }

  const deleteExpense = async (id) => {
    await supabase.from('expenses').delete().eq('id', id)
    setExpenses(p => p.filter(e => e.id !== id))
  }

  const total = expenses.reduce((a, e) => a + Number(e.amount), 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-display font-bold">Expenses</h1><p className="text-gray-400 text-sm mt-1">Track your business costs</p></div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Expense</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <div className="stat-card"><div className="text-xs text-gray-400 uppercase">Total Expenses</div><div className="text-2xl font-display font-bold text-red-400 mt-1">£{total.toFixed(2)}</div></div>
        <div className="stat-card"><div className="text-xs text-gray-400 uppercase">This Month</div><div className="text-2xl font-display font-bold text-white mt-1">{expenses.length}</div></div>
      </div>
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-gray-400 text-xs uppercase border-b border-white/5">{['Date','Category','Description','Amount','Recurring',''].map(h => <th key={h} className="text-left py-2 px-2">{h}</th>)}</tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={6} className="text-center py-8 text-gray-500">Loading...</td></tr> :
               expenses.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-gray-500">No expenses yet. Add one above!</td></tr> :
               expenses.map(e => (
                <tr key={e.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-2 px-2 text-gray-300">{e.date}</td>
                  <td className="py-2 px-2"><span className="px-2 py-0.5 rounded bg-white/10 text-xs">{e.category}</span></td>
                  <td className="py-2 px-2 text-gray-300">{e.description || '-'}</td>
                  <td className="py-2 px-2 text-red-400 font-semibold">£{Number(e.amount).toFixed(2)}</td>
                  <td className="py-2 px-2">{e.recurring ? <span className="text-brand-400 text-xs">✓ Yes</span> : <span className="text-gray-500 text-xs">No</span>}</td>
                  <td className="py-2 px-2"><button onClick={() => deleteExpense(e.id)} className="text-gray-600 hover:text-red-400"><X size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-display font-bold">Add Expense</h3><button onClick={() => setShowAdd(false)}><X size={20} className="text-gray-400" /></button></div>
            <form onSubmit={addExpense} className="space-y-3">
              <div><label className="text-xs text-gray-400">Date</label><input className="input mt-1" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required /></div>
              <div><label className="text-xs text-gray-400">Category</label><select className="input mt-1" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>{CATS.map(c => <option key={c}>{c}</option>)}</select></div>
              <div><label className="text-xs text-gray-400">Description</label><input className="input mt-1" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
              <div><label className="text-xs text-gray-400">Amount (£)</label><input className="input mt-1" type="number" step="0.01" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} required /></div>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.recurring} onChange={e => setForm(p => ({ ...p, recurring: e.target.checked }))} className="rounded" /><span className="text-sm text-gray-300">Recurring monthly</span></label>
              <div className="flex gap-3 pt-2"><button type="button" onClick={() => setShowAdd(false)} className="btn-secondary flex-1">Cancel</button><button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Add'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
