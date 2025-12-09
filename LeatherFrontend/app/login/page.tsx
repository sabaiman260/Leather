'use client'

import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { apiFetch } from '@/lib/api'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  return (
    <>
      <Header />
      <main className="bg-background min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <div className="border border-border p-8">
            <h1 className="text-3xl font-serif font-light tracking-wide mb-8 text-center">
              Sign In
            </h1>
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
            <form
              className="space-y-6"
              onSubmit={async (e) => {
                  e.preventDefault()
                  setLoading(true)
                  setError(null)

                  // Basic client-side validation to avoid predictable 400s
                  if (!email || !/\S+@\S+\.\S+/.test(email)) {
                    setError('Please enter a valid email address')
                    setLoading(false)
                    return
                  }

                  if (!password || password.length < 6) {
                    setError('Password must be at least 6 characters')
                    setLoading(false)
                    return
                  }

                  try {
                    const res = await apiFetch('/api/v1/auth/login', {
                      method: 'POST',
                      body: JSON.stringify({ userEmail: email, userPassword: password })
                    })
                    const accessToken = res?.data?.tokens?.accessToken
                    if (accessToken) {
                      try { localStorage.setItem('accessToken', accessToken) } catch {}
                    }
                    const role = res?.data?.user?.userRole
                    if (role === 'admin') window.location.href = '/admin'
                    else window.location.href = '/'
                  } catch (err: any) {
                    // apiFetch throws with the server response text when available
                    const message = err?.message || String(err) || 'Login failed'
                    setError(message)
                  } finally {
                    setLoading(false)
                  }
                }}
            >
              <div>
                <label className="block text-sm font-light mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-accent transition"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-light mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-accent transition pr-20"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="text-center text-sm mt-6">
              <p className="opacity-60">
                Don't have an account?{' '}
                <Link href="/register" className="text-accent hover:opacity-75">
                  Create Account
                </Link>
              </p>
            </div>

            <div className="mt-6 text-center">
              <Link href="#" className="text-sm text-accent hover:opacity-75">
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
