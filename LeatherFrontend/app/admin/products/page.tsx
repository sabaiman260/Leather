'use client'

import { useEffect, useState } from 'react'
import { apiFetch, API_BASE_URL, BackendProduct } from '@/lib/api'
import Image from 'next/image'

type FormState = {
  name: string
  price?: number
  description?: string
  discount?: number
  stock?: number
  sizes?: string // comma-separated
  colors?: string // comma-separated
  specs?: string // comma-separated
  isActive?: boolean
  category?: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<BackendProduct[]>([])
  const [form, setForm] = useState<FormState>({ name: '', price: undefined, description: '', discount: undefined, stock: undefined, sizes: '', colors: '', specs: '', isActive: true, category: '' })
  const [images, setImages] = useState<File[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [allCats, setAllCats] = useState<{ _id: string; name: string; type?: "Men" | "Women" | "Kids"; parentCategory?: string | null }[]>([])
  const [topCats, setTopCats] = useState<{ _id: string; name: string; type?: "Men" | "Women" | "Kids" }[]>([])
  const [subs, setSubs] = useState<{ _id: string; name: string; parentCategory?: string | null }[]>([])
  const [selectedTop, setSelectedTop] = useState<string>('')

  const loadByCategory = async (categoryId?: string) => {
    try {
      if (!categoryId) { setProducts([]); return }
      const res = await apiFetch(`/api/v1/products/category/${categoryId}`)
      setProducts(res?.data || [])
      setError(null)
    } catch (e: any) {
      setError(e?.message || 'Failed to load products')
    }
  }

  // Load all categories once and split into main/sub locally
  useEffect(() => {
    ;(async () => {
      try {
        const res = await apiFetch('/api/v1/categories')
        const cats = Array.isArray(res?.data) ? res.data : []
        setAllCats(cats)
        const mains = cats.filter((c: any) => !c.parentCategory)
        setTopCats(mains)
      } catch {
        setTopCats([])
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      if (selectedTop) {
        // reset chosen subcategory when main changes
        setForm(prev => ({ ...prev, category: '' }))
        const filtered = allCats.filter(c => {
          const parent = (c.parentCategory as any)?.toString?.() || c.parentCategory || ''
          return parent === selectedTop
        })
        setSubs(filtered)
      } else {
        setSubs([])
      }
    })()
  }, [selectedTop, allCats])

  useEffect(() => {
    loadByCategory(form.category)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.category])

  const createProduct = async () => {
    try {
      if (!form.name || form.price === undefined || !form.category) {
        setError('Name, price, and subcategory are required')
        return
      }
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('price', String(form.price))
      if (form.discount !== undefined) fd.append('discount', String(form.discount))
      if (form.stock !== undefined) fd.append('stock', String(form.stock))
      if (form.description) fd.append('description', form.description)
      if (form.category) fd.append('category', form.category)
      if (form.sizes) fd.append('sizes', form.sizes)
      if (form.colors) fd.append('colors', form.colors)
      if (form.specs) fd.append('specs', form.specs)
      fd.append('isActive', String(form.isActive ?? true))
      if (images) {
        images.forEach(file => fd.append('images', file))
      }
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
      const res = await fetch(`${API_BASE_URL}/api/v1/products/create`, {
        method: 'POST',
        credentials: 'include',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: fd
      })
      if (!res.ok) throw new Error('Failed to create')
      setError(null)
      await loadByCategory(form.category || '')
      setForm({ name: '', price: undefined, description: '', discount: undefined, stock: undefined, sizes: '', colors: '', specs: '', isActive: true, category: '' })
      setImages(null)
    } catch (e: any) {
      console.error('Create product error:', e)
      setError(e?.message || 'Failed to create')
    }
  }

  const selectedTopCat = selectedTop ? topCats.find(t => t._id === selectedTop) : null

  const deleteProduct = async (id: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
      const res = await fetch(`${API_BASE_URL}/api/v1/products/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      })
      if (!res.ok) throw new Error('Failed to delete')
      setError(null)
      await loadByCategory(form.category || '')
    } catch (e: any) {
      console.error('Delete product error:', e)
      setError(e?.message || 'Failed to delete')
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-serif">Products</h2>
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="border border-border p-4">
        <h3 className="text-lg font-serif mb-3">Create Product</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border border-border px-3 py-2" placeholder="Enter product name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="border border-border px-3 py-2" placeholder="Enter product price" type="number" value={form.price ?? ''} onChange={e => setForm({ ...form, price: e.target.value === '' ? undefined : Number(e.target.value) })} />
          <input className="border border-border px-3 py-2" placeholder="Enter discount percentage" type="number" value={form.discount ?? ''} onChange={e => setForm({ ...form, discount: e.target.value === '' ? undefined : Number(e.target.value) })} />
          <input className="border border-border px-3 py-2" placeholder="Enter stock quantity" type="number" value={form.stock ?? ''} onChange={e => setForm({ ...form, stock: e.target.value === '' ? undefined : Number(e.target.value) })} />
          <div className="grid grid-cols-2 gap-2">
            <select className="border border-border px-3 py-2" value={selectedTop} onChange={e => setSelectedTop(e.target.value)}>
              <option value="" disabled>Select main category</option>
              {topCats
                .filter(t => {
                  const label = (t.type || t.name || '').toLowerCase()
                  return label === 'men' || label === 'women' || label === 'kids'
                })
                .map(t => (
                  <option key={t._id} value={t._id}>{t.type || t.name}</option>
                ))}
            </select>
            <select className="border border-border px-3 py-2" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} disabled={!selectedTop}>
              <option value="" disabled>Select subcategory</option>
              {subs.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <input className="border border-border px-3 py-2" placeholder="Enter product description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <input className="border border-border px-3 py-2" placeholder="e.g., 6,7,8,9" value={form.sizes} onChange={e => setForm({ ...form, sizes: e.target.value })} />
          <input className="border border-border px-3 py-2" placeholder="e.g., Red, Blue, Black" value={form.colors} onChange={e => setForm({ ...form, colors: e.target.value })} />
          <input className="border border-border px-3 py-2" placeholder="e.g., Material:Leather, Sole:Rubber" value={form.specs} onChange={e => setForm({ ...form, specs: e.target.value })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
            Active
          </label>
          {/* helper messages removed per requirements */}
          <input
            className="border border-border px-3 py-2"
            type="file"
            multiple
            accept="image/*"
            onChange={e => {
              const files = Array.from(e.target.files || [])
              const imagesOnly = files.filter(f => f.type.startsWith('image/'))
              const limited = imagesOnly.slice(0, 4)
              if (imagesOnly.length > 4) setError('You can upload up to 4 images')
              setImages(limited)
            }}
          />
          {images && images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((f, i) => (
                <div key={i} className="relative overflow-hidden bg-muted aspect-square">
                  <img src={URL.createObjectURL(f)} alt={`preview-${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
        <button onClick={createProduct} className="mt-3 px-4 py-2 bg-primary text-primary-foreground">Create</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p._id} className="border border-border p-4">
            <div className="relative w-full h-48 bg-muted">
              <Image src={(p.imageUrls && p.imageUrls[0]) || '/placeholder.jpg'} alt={p.name} fill className="object-cover" />
            </div>
            <h4 className="mt-2 text-sm">{p.name}</h4>
            <p className="text-xs opacity-60">${p.price}</p>
            <button onClick={() => deleteProduct(p._id)} className="mt-2 text-red-600 text-xs">Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
