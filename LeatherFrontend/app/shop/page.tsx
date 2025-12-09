'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart-context'
import { Heart, ShoppingCart, ChevronDown } from 'lucide-react'
import { apiFetch, BackendProduct } from '@/lib/api'

type UIProduct = { id: string; name: string; price: number; category?: string; color?: string; image?: string };

export default function ShopPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const queryParam = searchParams.get('q')

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [selectedColor, setSelectedColor] = useState<string>('all')
  const [favorites, setFavorites] = useState<string[]>([])
  const [products, setProducts] = useState<UIProduct[]>([])
  const [categoryOptions, setCategoryOptions] = useState<string[]>(['all'])
  const { addToCart } = useCart()

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const q = queryParam ? queryParam.toLowerCase() : ''
      const categoryMatch = selectedCategory === 'all' || (product.category || '').toLowerCase() === selectedCategory
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1]
      const colorMatch = selectedColor === 'all' || product.color === selectedColor
      const searchMatch = !q || product.name.toLowerCase().includes(q) || (product.category || '').toLowerCase().includes(q)
      return categoryMatch && priceMatch && colorMatch && searchMatch
    })
  }, [selectedCategory, priceRange, selectedColor, queryParam])

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  useEffect(() => {
    (async () => {
      try {
        const categoryId = searchParams.get('categoryId')
        const res = categoryId ? await apiFetch(`/api/v1/products/category/${categoryId}`) : await apiFetch('/api/v1/products/getAll')
        const list: BackendProduct[] = (categoryId ? res?.data : res?.data) || []
        const mapped: UIProduct[] = list.map(p => ({
          id: p._id,
          name: p.name,
          price: p.price,
          category: (typeof p.category === 'object' && (p.category?.type || p.category?.name)) || undefined,
          image: (p.imageUrls && p.imageUrls[0]) || '/placeholder.jpg',
        }))
        setProducts(mapped)
      } catch {}
      try {
        const catRes = await apiFetch('/api/v1/categories')
        const cats: any[] = catRes?.data || []
        const unique = Array.from(new Set(cats.map((c: any) => (c.type || '').toLowerCase()).filter(Boolean)))
        setCategoryOptions(['all', ...unique])
      } catch {}
    })()
  }, [])

  return (
    <>
      <Header />
      <main className="bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-serif font-light tracking-wide mb-12">
            Our Collection
          </h1>

          <Suspense>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="md:col-span-1">
              <div className="space-y-8">
                {/* Category Filter */}
                <div>
                  <h3 className="text-sm font-light tracking-wide mb-4 uppercase opacity-75">Category</h3>
                  <div className="space-y-2">
                    {categoryOptions.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`block text-sm font-light ${
                          selectedCategory === cat
                            ? 'text-accent font-semibold'
                            : 'opacity-60 hover:opacity-100'
                        } transition`}
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <h3 id="filter-price" className="text-sm font-light tracking-wide mb-4 uppercase opacity-75">Price</h3>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="500"
                        id="price-range"
                        aria-labelledby="filter-price"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full"
                    />
                    <p className="text-xs opacity-60">
                      ${priceRange[0]} - ${priceRange[1]}
                    </p>
                  </div>
                </div>

                {/* Color Filter */}
                <div>
                  <h3 className="text-sm font-light tracking-wide mb-4 uppercase opacity-75">Color</h3>
                  <div className="space-y-2">
                    {['all', 'black', 'brown', 'Soft Luxe Shades'].map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`block text-sm font-light ${
                          selectedColor === color
                            ? 'text-accent font-semibold'
                            : 'opacity-60 hover:opacity-100'
                        } transition`}
                      >
                        {color.charAt(0).toUpperCase() + color.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="md:col-span-3">
              <p className="text-sm opacity-60 mb-6">
                Showing {filteredProducts.length} products
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredProducts.map(product => (
                  <Link key={product.id} href={`/products/${product.id}`} className="group">
                    <div className="relative overflow-hidden bg-muted aspect-square mb-4">
                      <Image
                        src={product.image ?? '/placeholder.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                      {favorites.includes(product.id) ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            toggleFavorite(product.id)
                          }}
                          aria-pressed="true"
                          aria-label="Remove from favorites"
                          title="Remove from favorites"
                          className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-accent hover:text-accent-foreground transition"
                        >
                          <Heart aria-hidden="true" className={`w-5 h-5 fill-current text-accent`} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            toggleFavorite(product.id)
                          }}
                          aria-pressed="false"
                          aria-label="Add to favorites"
                          title="Add to favorites"
                          className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-accent hover:text-accent-foreground transition"
                        >
                          <Heart aria-hidden="true" className={`w-5 h-5`} />
                        </button>
                      )}
                    </div>
                    <h3 className="text-sm font-light tracking-wide group-hover:text-accent transition">
                      {product.name}
                    </h3>
                    <p className="text-sm font-serif mt-2">${product.price.toFixed(2)}</p>
                    <Button
                          onClick={(e) => {
                            e.preventDefault()
                            addToCart({ id: product.id, name: product.name, price: product.price, image: product.image ?? '/placeholder.jpg' })
                          }}
                      className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                      size="sm"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
