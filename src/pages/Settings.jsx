import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function Settings() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [saving, setSaving] = useState(false)

  const updateProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id)
    if (error) toast.error('Failed to update profile')
    else { toast.success('Profile updated!'); refreshProfile() }
    setSaving(false)
  }

  const handleCancelSubscription = () => {
    toast('To cancel your subscription, please contact support or manage via the Stripe customer portal.', { icon: 'ℹ️' })
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-display font-bold mb-6">Settings</h1>
      <div className="card mb-4">
        <h3 className="font-semibold mb-4">Profile</h3>
        <form onSubmit={updateProfile} className="space-y-3">
          <div><label className="text-xs text-gray-400">Full Name</label><input className="input mt-1" value={fullName} onChange={e => setFullName(e.target.value)} /></div>
          <div><label className="text-xs text-gray-400">Email</label><input className="input mt-1" value={user?.email || ''} disabled /></div>
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
      <div className="card mb-4">
        <h3 className="font-semibold mb-2">Subscription</h3>
        <p className="text-sm text-gray-400 mb-3">Status: <span className="text-brand-400 font-semibold capitalize">{profile?.subscription_status || 'inactive'}</span></p>
        <button onClick={handleCancelSubscription} className="btn-secondary text-sm">Manage Subscription</button>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-3">Account</h3>
        <button onClick={() => supabase.auth.signOut()} className="text-red-400 hover:text-red-300 text-sm">Sign Out</button>
      </div>
    </div>
  )
}
