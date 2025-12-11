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
  category?: string // categoryId
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<BackendProduct[]>([])
  const [categories, setCategories] = useState<{ _id: string; name: string; slug: string }[]>([])
  const [form, setForm] = useState<FormState>({
    name: '', price: undefined, description: '', discount: undefined,
    stock: undefined, sizes: '', colors: '', specs: '', isActive: true, category: ''
  })
  const [images, setImages] = useState<File[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadProducts = async (catId?: string) => {
    try {
      if (!catId) return setProducts([])
      const res = await apiFetch(`/api/v1/products/category/${catId}`)
      setProducts(res?.data || [])
    } catch (e: any) {
      setError(e?.message || 'Failed to load products')
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch('/api/v1/categories')
        setCategories(res?.data || [])
      } catch {
        setCategories([])
      }
    })()
  }, [])

  useEffect(() => {
    loadProducts(form.category)
  }, [form.category])

  const createProduct = async () => {
    if (!form.name || !form.price || !form.category) {
      setError('Name, price and category are required!')
      return
    }

    try {
      const fd = new FormData()

      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null) fd.append(key, String(value))
      })

      if (images) {
        images.forEach(file => fd.append('images', file))
      }

      const token = localStorage.getItem('accessToken')

      const res = await fetch(`${API_BASE_URL}/api/v1/products/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: fd
      })

      if (!res.ok) throw new Error('Failed to create product')

      setError(null)

      loadProducts(form.category)
      setForm({
        name: '', price: undefined, description: '', discount: undefined,
        stock: undefined, sizes: '', colors: '', specs: '', isActive: true, category: ''
      })
      setImages(null)
    } catch (e: any) {
      setError(e?.message || 'Failed to create')
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken')

      const res = await fetch(`${API_BASE_URL}/api/v1/products/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      })

      if (!res.ok) throw new Error('Failed to delete')

      loadProducts(form.category)
    } catch (e: any) {
      setError(e?.message || 'Failed to delete')
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-serif">Products</h2>
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* CREATE PRODUCT */}
      <div className="border p-4">
        <h3 className="text-lg mb-4 font-serif">Create Product</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border p-2" placeholder="Name"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

          <input type="number" className="border p-2" placeholder="Price"
            value={form.price || ''} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />

          <select
            className="border p-2"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          <input className="border p-2" placeholder="Description"
            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

          <input type="file" multiple onChange={e => setImages(Array.from(e.target.files || []))} />
        </div>

        <button onClick={createProduct} className="mt-3 px-4 py-2 bg-black text-white">
          Create Product
        </button>
      </div>

      {/* PRODUCTS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {products.map(p => (
          <div key={p._id} className="border p-4">
            <h4 className="font-semibold text-md">{p.name}</h4>

            {p.images?.[0] && (
              <Image
                src={p.images[0]}
                width={200}
                height={200}
                alt={p.name}
                className="object-cover w-full h-40"
              />
            )}

            <p className="text-sm opacity-70">Rs. {p.price}</p>

            <button
              onClick={() => deleteProduct(p._id)}
              className="mt-3 text-red-500 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
