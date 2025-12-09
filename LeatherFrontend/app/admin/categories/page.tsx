'use client'

import { useEffect, useMemo, useState } from 'react'
import { apiFetch, API_BASE_URL } from '@/lib/api'

type Category = { _id: string; name: string; type?: "Men" | "Women" | "Kids"; isActive?: boolean; parentCategory?: string | null }

export default function AdminCategoriesPage() {
  const [topCats, setTopCats] = useState<Category[]>([])
  const [subs, setSubs] = useState<Category[]>([])
  const [selectedTop, setSelectedTop] = useState<string | null>(null)
  const [name, setName] = useState('')
  // type is derived from selectedTop
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      const top = await apiFetch('/api/v1/categories/main')
      setTopCats(top?.data || [])
      if (selectedTop) {
        const subRes = await apiFetch(`/api/v1/categories/sub/${selectedTop}`)
        setSubs(subRes?.data || [])
      } else {
        setSubs([])
      }
    } catch (e: any) {
      setError('Unauthorized. Admin login required.')
    }
  }

  useEffect(() => {
    load()
  }, [selectedTop])

  const createCategory = async () => {
    try {
      const parent = topCats.find(t => t._id === selectedTop)
      const derivedType = parent?.type || undefined
      const payload: any = { name, description }
      if (selectedTop) {
        payload.parentCategory = selectedTop
        if (derivedType) payload.type = derivedType
      } else {
        // creating a main category requires type
        if (!derivedType) {
          return setError('Select Men/Women/Kids above or use Ensure button')
        }
        payload.type = derivedType
        payload.parentCategory = null
      }
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
      const res = await fetch(`${API_BASE_URL}/api/v1/categories/create`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to create')
      setError(null)
      await load()
      setName(''); setDescription('')
    } catch (e: any) {
      console.error('Create category error:', e)
      setError(e?.message || 'Failed to create')
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
      const res = await fetch(`${API_BASE_URL}/api/v1/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      })
      if (!res.ok) throw new Error('Failed to delete')
      setError(null)
      await load()
    } catch (e: any) {
      console.error('Delete category error:', e)
      setError(e?.message || 'Failed to delete')
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-serif">Categories</h2>
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="border border-border p-4">
        <h3 className="text-lg font-serif mb-3">Main Categories</h3>
        <div className="flex gap-2 mb-4">
          {['Men','Women','Kids'].map(label => {
            const exists = topCats.find(t => t.name.toLowerCase() === label.toLowerCase())
            return (
              <button
                key={label}
                className={`px-3 py-2 border ${selectedTop && (topCats.find(t=>t._id===selectedTop)?.name===label) ? 'bg-muted' : ''}`}
                onClick={async () => {
                  try {
                    const found = topCats.find(t => t.name.toLowerCase() === label.toLowerCase())
                    if (found) { setSelectedTop(found._id); return }
                    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
                    const res = await fetch(`${API_BASE_URL}/api/v1/categories/create`, {
                      method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                      body: JSON.stringify({ name: label, type: label, description: `${label} root`, parentCategory: null })
                    })
                    if (!res.ok) throw new Error('Failed to create main category')
                    const data = await res.json().catch(() => null)
                    const created = data?.data?._id || data?.data?.id
                    await load()
                    setSelectedTop(created || null)
                  } catch (e: any) {
                    console.error('Select/Create main category error:', e)
                    setError(e?.message || 'Failed to select/create main category')
                  }
                }}
                title={exists ? 'Select category' : 'Create category'}
              >
                {label}
              </button>
            )
          })}
          <button
            className="ml-auto px-3 py-2 border"
            onClick={async () => {
              for (const label of ['Men','Women','Kids']) {
                const exists = topCats.find(t => t.name.toLowerCase() === label.toLowerCase())
                if (!exists) {
                  try {
                    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
                    // send capitalized type to match backend enum: "Men" | "Women" | "Kids"
                    const res = await fetch(`${API_BASE_URL}/api/v1/categories/create`, {
                      method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                      body: JSON.stringify({ name: label, type: label, description: `${label} root`, parentCategory: null })
                    })
                    if (!res.ok) throw new Error('Failed to create root category')
                  } catch (e: any) {
                    console.error('Ensure root category error:', e)
                    setError(e?.message || 'Failed to ensure root categories')
                  }
                }
              }
              await load()
            }}
          >Ensure Men/Women/Kids</button>
        </div>

        <h3 className="text-lg font-serif mb-3">Create Subcategory {selectedTop ? '' : '(select a main category above)'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="border border-border px-3 py-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input className="border border-border px-3 py-2" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <button onClick={createCategory} className="mt-3 px-4 py-2 bg-primary text-primary-foreground" disabled={!selectedTop}>Create Subcategory</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subs.map(c => (
          <div key={c._id} className="border border-border p-4">
            <h4 className="text-sm">{c.name}</h4>
            <p className="text-xs opacity-60">{c.type}</p>
            <button onClick={() => deleteCategory(c._id)} className="mt-2 text-red-600 text-xs">Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
