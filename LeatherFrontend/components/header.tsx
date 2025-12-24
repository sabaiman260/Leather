'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, X, Search } from 'lucide-react'
import { useCart } from '@/components/cart-context'

const NAV_TEXT_COLOR = 'text-[#E6D8C8]'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const { totalItems } = useCart()

  useEffect(() => {
    const q = searchParams?.get('q') || ''
    setSearch(q)
  }, [searchParams])

  return (
    <>
      {/* ================= DESKTOP HEADER ================= */}
      <header className="hidden md:block bg-header-leather fixed top-0 w-full z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative w-14 h-14 transition-transform group-hover:scale-105">
              <Image
                src="/logos.png"
                alt="Flex Leather Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className={`flex flex-col ${NAV_TEXT_COLOR}`}>
              <span className="text-[10px] tracking-[0.3em] uppercase opacity-70">
                ESTD 2025
              </span>
              <span className="text-[15px] font-serif font-bold tracking-widest uppercase leading-none">
                Flex Leather
              </span>
            </div>
          </Link>

          {/* Search */}
          <div className="flex-1 mx-12 max-w-md">
            <div className="flex items-center border border-white/20 bg-white/10 px-4 py-2 rounded-full focus-within:bg-white/20 transition-all">
              <Search
                className="w-4 h-4 text-[#E6D8C8] cursor-pointer"
                onClick={() =>
                  search && router.push(`/shop?q=${encodeURIComponent(search)}`)
                }
              />
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 ml-2 bg-transparent outline-none text-sm text-[#E6D8C8] placeholder:text-[#E6D8C8]/60"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && search.trim()) {
                    router.push(`/shop?q=${encodeURIComponent(search.trim())}`)
                  }
                }}
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className={`flex gap-8 items-center font-medium text-sm tracking-wide ${NAV_TEXT_COLOR}`}>
            <Link href="/shop" className="hover:opacity-70 transition">Shop</Link>
            <Link href="/collections" className="hover:opacity-70 transition">Collections</Link>
            <Link href="/about" className="hover:opacity-70 transition">About</Link>
            <Link href="/login" className="hover:opacity-70 transition">Account</Link>

            <Link href="/cart" className="relative p-2 hover:bg-white/10 rounded-full transition">
              <ShoppingCart className="w-5 h-5 text-[#E6D8C8]" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-[#E6D8C8] text-black font-bold text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>

      {/* ================= MOBILE HEADER ================= */}
      <header className="md:hidden bg-header-leather fixed top-0 w-full z-50 shadow-sm">
        <div className="px-4 py-3 flex justify-between items-center">

          {/* Mobile Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/logo.png"
                alt="Flex Leather Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className={`text-lg font-serif tracking-widest uppercase ${NAV_TEXT_COLOR}`}>
              Flex Leather
            </span>
          </Link>

          {/* Mobile Actions */}
          <div className="flex gap-2 items-center">
            <Link href="/cart" className="relative p-2">
              <ShoppingCart className="w-5 h-5 text-[#E6D8C8]" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-[#E6D8C8] text-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="text-[#E6D8C8]" /> : <Menu className="text-[#E6D8C8]" />}
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
