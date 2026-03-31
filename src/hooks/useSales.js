import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { startOfMonth, endOfMonth, subDays, format } from 'date-fns'

export function useSales() {
  const { user } = useAuth()
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSales = useCallback(async (filter = 'MTD') => {
    if (!user) return
    setLoading(true)
    let query = supabase.from('sales').select('*').eq('user_id', user.id).order('date', { ascending: false })
    const now = new Date()
    if (filter === 'MTD') {
      query = query.gte('date', format(startOfMonth(now), 'yyyy-MM-dd')).lte('date', format(endOfMonth(now), 'yyyy-MM-dd'))
    } else if (filter === '7D') {
      query = query.gte('date', format(subDays(now, 7), 'yyyy-MM-dd'))
    } else if (filter === 'YTD') {
      query = query.gte('date', `${now.getFullYear()}-01-01`)
    }
    const { data, error } = await query
    if (!error) setSales(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchSales() }, [fetchSales])

  const addSale = async (sale) => {
    const { data, error } = await supabase.from('sales').insert({ ...sale, user_id: user.id }).select().single()
    if (!error) setSales(prev => [data, ...prev])
    return { data, error }
  }

  const deleteSale = async (id) => {
    const { error } = await supabase.from('sales').delete().eq('id', id)
    if (!error) setSales(prev => prev.filter(s => s.id !== id))
    return { error }
  }

  const stats = {
    revenue: sales.reduce((a, s) => a + Number(s.price), 0),
    profit: sales.reduce((a, s) => a + Number(s.profit), 0),
    cost: sales.reduce((a, s) => a + Number(s.cost), 0),
    fees: sales.reduce((a, s) => a + Number(s.fees), 0),
    count: sales.length,
    avgRoi: sales.length > 0 ? sales.reduce((a, s) => a + Number(s.roi), 0) / sales.length : 0,
  }

  return { sales, loading, fetchSales, addSale, deleteSale, stats }
}
