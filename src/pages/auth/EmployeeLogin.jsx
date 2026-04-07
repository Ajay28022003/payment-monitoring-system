import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp, Mail, Lock, Eye, EyeOff,
  ArrowRight, UserCircle2
} from 'lucide-react'

export default function EmployeeLogin() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.email)    e.email    = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleLogin = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/orders')
    }, 1200)
  }

  const handleChange = (field, value) => {
    setForm(p => ({ ...p, [field]: value }))
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }))
  }

  return (
    <div className="min-h-screen flex bg-[var(--color-background)]">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sky-500 to-sky-700 
                      relative overflow-hidden flex-col justify-between p-12">

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] 
                          bg-white/5 rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] 
                          bg-white/5 rounded-full" />
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
              backgroundSize: '28px 28px'
            }}
          />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl 
                          flex items-center justify-center border border-white/30">
            <TrendingUp size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">PayTrack</p>
            <p className="text-white/60 text-xs mt-0.5">Payment Monitor</p>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative space-y-8">
          <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-3xl 
                          flex items-center justify-center border border-white/20">
            <UserCircle2 size={32} className="text-white" />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Employee<br />
              <span className="text-white/70">Workspace</span>
            </h1>
            <p className="text-white/60 text-base mt-4 leading-relaxed max-w-sm">
              Track your assigned orders, log follow-ups, update
              payment statuses and stay on top of your targets.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-2">
            {['My Orders', 'Follow-up Log', 'Payment Updates', 'Daily Tasks'].map(f => (
              <span key={f}
                className="px-3 py-1.5 bg-white/10 border border-white/20 
                           rounded-full text-xs font-medium text-white/80">
                {f}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            {[
              { value: '340+', label: 'My Orders' },
              { value: '12', label: "Today's Due" },
              { value: '94%', label: 'Follow Rate' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-white/50 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <p className="text-white/40 text-xs">
            © 2025 PayTrack · Employee Portal
          </p>
        </div>
      </div>

      {/* ── Right Panel — Login Form ── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-sky-500 rounded-xl flex items-center justify-center">
              <TrendingUp size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-800">PayTrack</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 
                            bg-sky-50 rounded-full mb-4">
              <UserCircle2 size={13} className="text-sky-600" />
              <span className="text-xs font-semibold text-sky-600">
                Employee Portal
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Good to see you
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Sign in to access your workspace and tasks
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 
                                uppercase tracking-wide mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 
                                           text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm
                              text-gray-800 placeholder-gray-400
                              focus:outline-none focus:ring-2 focus:ring-sky-500/20 
                              focus:border-sky-500 transition-all duration-200
                              ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Password
                </label>
                <button className="text-xs font-medium text-sky-600 hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 
                                           text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => handleChange('password', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className={`w-full pl-10 pr-11 py-3 bg-white border rounded-xl text-sm
                              text-gray-800 placeholder-gray-400
                              focus:outline-none focus:ring-2 focus:ring-sky-500/20
                              focus:border-sky-500 transition-all duration-200
                              ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                />
                <button
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 
                             text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>
              )}
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 
                         py-3.5 px-6 rounded-xl font-semibold text-sm text-white
                         bg-sky-500 hover:bg-sky-600
                         disabled:opacity-70 disabled:cursor-not-allowed
                         shadow-lg shadow-sky-500/25
                         hover:shadow-xl hover:shadow-sky-500/30
                         active:scale-[0.98] transition-all duration-200"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In as Employee
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Switch to Admin */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Are you an admin?{' '}
              <button
                onClick={() => navigate('/admin/login')}
                className="font-semibold text-[var(--color-primary-600)] hover:underline"
              >
                Login here →
              </button>
            </p>
          </div>

          {/* Demo Hint */}
          <div className="mt-6 p-4 bg-sky-50 rounded-2xl border border-sky-100">
            <p className="text-xs font-semibold text-sky-600 mb-1.5">
              Demo Credentials
            </p>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-500">
                Email: <span className="font-medium text-gray-700">emp@paytrack.com</span>
              </p>
              <p className="text-xs text-gray-500">
                Password: <span className="font-medium text-gray-700">emp123</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}