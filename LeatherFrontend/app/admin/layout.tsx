"use client"
import Header from '@/components/header'
import Footer from '@/components/footer'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminNavbar from '@/components/admin/AdminNavbar'
import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const me = await apiFetch('/api/v1/auth/me')
        if (me?.data?.userRole === 'admin') setAuthorized(true)
        else throw new Error('not admin')
      } catch {
        setAuthorized(false)
        window.location.href = '/login'
      }
    })()
  }, [])

  if (authorized === null) return <p className="px-4 py-6">Checking admin access…</p>
  if (authorized === false) return null

  return (
    <>
      <Header />
      <main className="bg-background min-h-screen">
        <AdminNavbar />
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-16 pb-6 flex gap-6">
          <AdminSidebar />
          <div className="flex-1">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
