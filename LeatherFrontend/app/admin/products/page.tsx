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
  sizes?: string
  colors?: string
  specs?: string
  isActive?: boolean
  category?: string
}

const FIXED_CATEGORIES = ['MEN', 'WOMEN', 'KIDS', 'OFFICE', 'GIFT IDEAS']

export default function AdminProductsPage() {
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([])
  const [products, setProducts] = useState<BackendProduct[]>([])
  const [form, setForm] = useState<FormState>({
    name: '',
    price: undefined,
    description: '',
    discount: undefined,
    stock: undefined,
    sizes: '',
    colors: '',
    specs: '',
    isActive: true,
    category: ''
  })
  const [images, setImages] = useState<File[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadCategories = async () => {
    try {
      const res = await apiFetch('/api/v1/categories')
      setCategories(res?.data?.filter((c: any) => FIXED_CATEGORIES.includes(c.name.toUpperCase())) || [])
    } catch (e) {
      console.error(e)
    }
  }

  const loadProducts = async (categoryId?: string) => {
    try {
      if (!categoryId) return setProducts([])
      const res = await apiFetch(`/api/v1/products/category/${categoryId}`)
      setProducts(res?.data || [])
    } catch (e: any) {
      setError(e?.message || 'Failed to load products')
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    if (form.category) loadProducts(form.category)
  }, [form.category])

  const createProduct = async () => {
    if (!form.name || !form.price || !form.category) {
      setError('Name, price, and category are required!')
      return
    }

    try {
      const fd = new FormData()

      // Convert sizes/colors/specs to proper comma-separated string
      const sanitizeArrayString = (v?: string) =>
        v ? v.split(',').map(s => s.trim()).filter(Boolean).join(',') : ''

      fd.append('name', form.name)
      fd.append('price', String(form.price))
      fd.append('discount', String(form.discount ?? 0))
      fd.append('stock', String(form.stock ?? 0))
      fd.append('description', form.description ?? '')
      fd.append('category', form.category)
      fd.append('isActive', String(form.isActive ?? true))
      fd.append('sizes', sanitizeArrayString(form.sizes))
      fd.append('colors', sanitizeArrayString(form.colors))
      fd.append('specs', sanitizeArrayString(form.specs))

      images?.forEach(f => fd.append('images', f))

      const token = localStorage.getItem('accessToken')
      const res = await fetch(`${API_BASE_URL}/api/v1/products/create`, {
        method: 'POST',
        credentials: 'include',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: fd
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err?.message || 'Failed to create product')
      }

      // Reset form but keep category selected
      const oldCategory = form.category
      setForm({
        name: '',
        price: undefined,
        description: '',
        discount: undefined,
        stock: undefined,
        sizes: '',
        colors: '',
        specs: '',
        isActive: true,
        category: oldCategory
      })
      setImages(null)
      loadProducts(oldCategory)
      setError(null)
    } catch (e: any) {
      setError(e?.message || 'Failed to create product')
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken')
      await fetch(`${API_BASE_URL}/api/v1/products/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      })
      if (form.category) loadProducts(form.category)
    } catch (e: any) {
      setError(e?.message || 'Failed to delete product')
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-serif">Products</h2>
      {error && <p className="text-red-600">{error}</p>}

      <div className="border p-4">
        <h3 className="text-lg mb-3 font-serif">Create Product</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border p-2" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="border p-2" type="number" placeholder="Price" value={form.price || ''} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
          <input className="border p-2" type="number" placeholder="Discount" value={form.discount || ''} onChange={e => setForm({ ...form, discount: Number(e.target.value) })} />
          <input className="border p-2" type="number" placeholder="Stock" value={form.stock || ''} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} />
          <input className="border p-2" placeholder="Sizes (comma separated)" value={form.sizes} onChange={e => setForm({ ...form, sizes: e.target.value })} />
          <input className="border p-2" placeholder="Colors (comma separated)" value={form.colors} onChange={e => setForm({ ...form, colors: e.target.value })} />
          <input className="border p-2" placeholder="Specs (comma separated)" value={form.specs} onChange={e => setForm({ ...form, specs: e.target.value })} />
          <select className="border p-2" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select className="border p-2" value={form.isActive ? 'true' : 'false'} onChange={e => setForm({ ...form, isActive: e.target.value === 'true' })}>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <textarea className="border p-2" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
          <input type="file" multiple accept="image/*" onChange={e => setImages(Array.from(e.target.files || []))} />
        </div>

        <button onClick={createProduct} className="mt-3 px-4 py-2 bg-black text-white">Create Product</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {products.map(p => (
          <div key={p._id} className="border p-4">
            <h4 className="font-semibold">{p.name}</h4>
            {p.imageUrls?.[0] && <Image src={p.imageUrls[0]} width={200} height={200} alt={p.name} className="object-cover w-full h-40" />}
            <p className="text-sm opacity-70">Rs. {p.price}</p>
            <p className="text-xs text-gray-500">{p.sizes ? `Sizes: ${p.sizes.join(', ')}` : ''}</p>
            <p className="text-xs text-gray-500">{p.colors ? `Colors: ${p.colors.join(', ')}` : ''}</p>
            <p className="text-xs text-gray-500">{p.specs ? `Specs: ${p.specs.join(', ')}` : ''}</p>
            <button onClick={() => deleteProduct(p._id)} className="mt-2 text-red-500 text-sm">Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
