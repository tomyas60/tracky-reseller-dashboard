import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    const { error } = await signUp(form.email, form.password, form.fullName)
    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      toast.success('Account created! Please check your email to confirm.')
      navigate('/subscribe')
    }
  }

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-display font-bold text-white">
            <span className="text-3xl">📦</span> TRACKY
          </Link>
          <h1 className="text-2xl font-display font-bold text-white mt-6">Create your account</h1>
          <p className="text-gray-400 mt-2">Start your reselling journey today</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
              <input className="input" type="text" placeholder="John Doe" value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} required />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Password</label>
              <input className="input" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
            </div>
            <button className="btn-primary w-full" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account & Subscribe'}
            </button>
          </form>
          <p className="text-center text-gray-400 text-sm mt-4">
            Already have an account? <Link to="/login" className="text-brand-400 hover:text-brand-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
