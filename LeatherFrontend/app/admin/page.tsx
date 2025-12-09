'use client'

import Link from 'next/link'

export default function AdminHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link prefetch={false} href="/admin/products" className="border border-border p-6 hover:bg-muted">Manage Products</Link>
        <Link prefetch={false} href="/admin/categories" className="border border-border p-6 hover:bg-muted">Manage Categories</Link>
      </div>
    </div>
  )
}
