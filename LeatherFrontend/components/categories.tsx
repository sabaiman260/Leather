'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'

type Cat = { _id: string; name: string; type?: string }

export default function Categories() {
  const [topCats, setTopCats] = useState<Cat[]>([])
  const [subs, setSubs] = useState<Cat[]>([])
  const [activeTop, setActiveTop] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch('/api/v1/categories?parent=null')
        setTopCats(res?.data || [])
      } catch {}
    })()
  }, [])

  const loadSubs = async (id: string) => {
    setActiveTop(id)
    try {
      const res = await apiFetch(`/api/v1/categories?parent=${id}`)
      setSubs(res?.data || [])
    } catch {}
  }

  return (
    <section className="bg-transparent py-16 md:py-20 relative overflow-hidden">
      {/* Bokeh background effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-20 w-32 h-32 bg-amber-700 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-10 right-20 w-40 h-40 bg-amber-800 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {topCats.map((category) => (
            <button
              key={category._id}
              type="button"
              className="group relative flex items-center justify-center"
              onClick={() => loadSubs(category._id)}
            >
              {/* Rounded Container */}
              <div className="relative w-full aspect-square rounded-full overflow-hidden bg-neutral-700">
                {/* Background Image */}
                {/* eslint-disable-next-line react/no-inline-styles */}
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                  <img src={'/placeholder.jpg'} alt={category.name} className="w-full h-full object-cover" />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent group-hover:from-black/70 group-hover:via-black/40 transition-all duration-300" />
                </div>

                {/* Category Text */}
                <div className="absolute inset-0 flex items-end justify-center pb-6 md:pb-8">
                  <h3 className="text-xl md:text-2xl font-light tracking-widest text-white text-center px-3 transition-all duration-300 group-hover:text-amber-200">
                    {category.name}
                  </h3>
                </div>
              </div>
            </button>
          ))}
        </div>
        {activeTop && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-6">
            {subs.map(s => (
              <Link prefetch={false} key={s._id} href={`/shop?categoryId=${s._id}`} className="block border border-border px-4 py-3 text-center hover:bg-muted">
                {s.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
