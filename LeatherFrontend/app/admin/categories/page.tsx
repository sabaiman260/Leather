'use client'

import { useEffect, useState } from 'react'
import { apiFetch, API_BASE_URL } from '@/lib/api'

type Category = {
  _id: string
  name: string
  slug: string
  description?: string
  isActive?: boolean
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  const loadCategories = async () => {
    try {
      const res = await apiFetch('/api/v1/categories')
      setCategories(res?.data || [])
      setError(null)
    } catch (e: any) {
      setError('Failed to load categories')
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const createCategory = async () => {
    if (!name.trim()) return setError('Category name is required')
    try {
      const token = localStorage.getItem('accessToken')

      const res = await fetch(`${API_BASE_URL}/api/v1/categories/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          name,
          description,
          parentCategory: null // option A → always null
        })
      })

      if (!res.ok) throw new Error('Failed to create category')

      setError(null)
      setName('')
      setDescription('')
      loadCategories()
    } catch (e: any) {
      setError(e?.message || 'Error creating category')
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken')

      const res = await fetch(`${API_BASE_URL}/api/v1/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      })

      if (!res.ok) throw new Error('Failed to delete')

      setError(null)
      loadCategories()
    } catch (e: any) {
      setError(e?.message || 'Error deleting category')
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-serif">Categories</h2>
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="border p-4">
        <h3 className="text-lg mb-3 font-serif">Create Category</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="border px-3 py-2"
            placeholder="Category name (e.g. WOMEN)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="border px-3 py-2"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button onClick={createCategory} className="mt-3 px-4 py-2 bg-black text-white">
          Create Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((c) => (
          <div key={c._id} className="border p-4">
            <h4 className="text-md font-semibold">{c.name}</h4>
            <p className="text-xs opacity-60">Slug: {c.slug}</p>
            <button
              onClick={() => deleteCategory(c._id)}
              className="mt-2 text-red-600 text-xs"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
