import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LayoutDashboard, Receipt, Package, BarChart3, Truck, Settings, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

const nav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/expenses', icon: Receipt, label: 'Expenses' },
  { to: '/inventory', icon: Package, label: 'Inventory' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/suppliers', icon: Truck, label: 'Suppliers' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function AppLayout() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-[#070d1a] border-r border-white/5">
      <div className="px-5 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📦</span>
          <span className="font-display font-bold text-lg text-white">TRACKY</span>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => clsx('sidebar-link', isActive && 'active')} onClick={() => setSidebarOpen(false)}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 pb-4 border-t border-white/5 pt-4">
        <div className="px-3 py-2 mb-2">
          <p className="text-xs text-gray-500">Signed in as</p>
          <p className="text-sm text-white truncate">{profile?.full_name || user?.email}</p>
          <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 mt-1 inline-block">Pro</span>
        </div>
        <button onClick={handleSignOut} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-56 lg:w-64 flex-shrink-0 flex-col">
        <Sidebar />
      </div>
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 h-full flex flex-col">
            <Sidebar />
          </div>
        </div>
      )}
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="md:hidden flex items-center justify-between px-4 py-4 border-b border-white/5 bg-[#070d1a]">
          <div className="flex items-center gap-2"><span className="text-xl">📦</span><span className="font-display font-bold">TRACKY</span></div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>{sidebarOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
