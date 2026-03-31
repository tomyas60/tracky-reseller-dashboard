import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444', '#06b6d4']

export default function Analytics() {
  const { user } = useAuth()
  const [sales, setSales] = useState([])

  useEffect(() => {
    if (!user) return
    supabase.from('sales').select('*').eq('user_id', user.id)
      .then(({ data }) => setSales(data || []))
  }, [user])

  const platformData = Object.entries(
    sales.reduce((acc, s) => { acc[s.platform] = (acc[s.platform] || 0) + Number(s.profit); return acc }, {})
  ).map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }))

  const monthlyData = Object.entries(
    sales.reduce((acc, s) => {
      const month = s.date?.substring(0, 7)
      if (!acc[month]) acc[month] = { revenue: 0, profit: 0 }
      acc[month].revenue += Number(s.price)
      acc[month].profit += Number(s.profit)
      return acc
    }, {})
  ).sort().map(([month, v]) => ({ month, ...v }))

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Analytics</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">Monthly Revenue vs Profit</h3>
          {monthlyData.length === 0 ? <p className="text-gray-500 text-sm text-center py-8">No data yet</p> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={v => `£${v}`} />
                <Tooltip contentStyle={{ background: '#0d1b2a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} formatter={v => `£${v.toFixed(2)}`} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4,4,0,0]} />
                <Bar dataKey="profit" fill="#22c55e" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">Profit by Platform</h3>
          {platformData.length === 0 ? <p className="text-gray-500 text-sm text-center py-8">No data yet</p> : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={platformData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value">
                  {platformData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0d1b2a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} formatter={v => `£${v}`} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
