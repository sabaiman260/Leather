'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart-context'
import { Heart, ShoppingCart } from 'lucide-react'
import { apiFetch, BackendProduct } from '@/lib/api'

type UIProduct = {
  id: string
  name: string
  price: number
  image: string
}

export default function ShopPage() {
  const searchParams = useSearchParams()
  const categorySlug = searchParams.get('category') // men, women, kids, office, gift-ideas
  const queryParam = searchParams.get('q')

  const [products, setProducts] = useState<UIProduct[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])

  const { addToCart } = useCart()

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const res = categorySlug
          ? await apiFetch(`/api/v1/products/category/${categorySlug}`)
          : await apiFetch('/api/v1/products/getAll')

        const list: BackendProduct[] = res?.data || []

        const mapped: UIProduct[] = list.map(p => ({
          id: p._id,
          name: p.name,
          price: p.price,
          image:
            Array.isArray(p.imageUrls) && p.imageUrls.length > 0
              ? p.imageUrls[0]
              : '/placeholder.jpg',
        }))

        console.log('SHOP PRODUCTS:', mapped)
        setProducts(mapped)
      } catch (err) {
        console.error('Failed to load products', err)
      }
    })()
  }, [categorySlug])

  /* ---------------- LOCAL FILTERS ---------------- */
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const q = queryParam?.toLowerCase() || ''
      const priceMatch =
        p.price >= priceRange[0] && p.price <= priceRange[1]
      const searchMatch =
        !q || p.name.toLowerCase().includes(q)

      return priceMatch && searchMatch
    })
  }, [products, priceRange, queryParam])

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  return (
    <>
      <Header />

      <main className="bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-12">

          <h1 className="text-4xl font-serif mb-8 capitalize">
            {categorySlug
              ? categorySlug.replace('-', ' ')
              : 'All Products'}
          </h1>

          <Suspense>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

              {/* FILTER SIDEBAR */}
              <aside>
                <h3 className="mb-4 text-sm uppercase opacity-70">Price</h3>
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={priceRange[1]}
                  onChange={e =>
                    setPriceRange([0, Number(e.target.value)])
                  }
                  className="w-full"
                />
                <p className="text-xs opacity-60 mt-2">
                  $0 – ${priceRange[1]}
                </p>
              </aside>

              {/* PRODUCTS GRID */}
              <section className="md:col-span-3">
                <p className="mb-6 text-sm opacity-60">
                  Showing {filteredProducts.length} products
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {filteredProducts.map(p => (
                    <Link
                      key={p.id}
                      href={`/products/${p.id}`}
                      className="group"
                    >
                      <div className="relative aspect-square bg-muted overflow-hidden mb-4">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-cover transition group-hover:scale-105"
                        />

                        <button
                          onClick={e => {
                            e.preventDefault()
                            toggleFavorite(p.id)
                          }}
                          className="absolute top-4 right-4 bg-white p-2 rounded-full"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              favorites.includes(p.id)
                                ? 'fill-accent text-accent'
                                : ''
                            }`}
                          />
                        </button>
                      </div>

                      <h3 className="text-sm">{p.name}</h3>
                      <p className="font-serif">
                        ${p.price.toFixed(2)}
                      </p>

                      <Button
                        size="sm"
                        className="w-full mt-3"
                        onClick={e => {
                          e.preventDefault()
                          addToCart({
                            id: p.id,
                            name: p.name,
                            price: p.price,
                            image: p.image,
                          })
                        }}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </Link>
                  ))}
                </div>
              </section>

            </div>
          </Suspense>
        </div>
      </main>

      <Footer />
    </>
  )
}
