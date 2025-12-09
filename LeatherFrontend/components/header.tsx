// // // 'use client'

// // Active Header component (cleaned up)
// 'use client'

// import { useState, useEffect } from 'react'
// import { useSearchParams } from 'next/navigation'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { ShoppingCart, Menu, X, Search } from 'lucide-react'
// import { useCart } from '@/components/cart-context'

// export default function Header() {
// 	const [isOpen, setIsOpen] = useState(false)
// 	const [search, setSearch] = useState('')
// 	const searchParams = useSearchParams()

// 	useEffect(() => {
// 		const q = searchParams?.get('q') || ''
// 		setSearch(q)
// 	}, [searchParams])
// 	const router = useRouter()

// 	const { totalItems } = useCart()

// 	return (
// 		<>
// 			<header className="hidden md:block bg-brand-brown text-white border-b border-primary-foreground/10 relative shadow-sm">
// 				<div className="max-w-7xl container-max px-6 py-3 flex justify-between items-center">
// 					<Link href="/" className="text-2xl font-serif font-light tracking-widest text-white">FlexLeather</Link>

// 					<div className="flex-1 mx-8 flex items-center">
// 						<div className="w-full flex items-center border border-border bg-white/5 px-3 py-2 rounded-md backdrop-blur-sm shadow-sm">
// 							<Search className="w-4 h-4 text-white/80 cursor-pointer" onClick={() => { if (search) router.push(`/shop?q=${encodeURIComponent(search)}`) }} />
// 							<input
// 								type="text"
// 								placeholder="Search products..."
// 								className="flex-1 ml-2 bg-transparent outline-none text-sm text-white placeholder:text-white/70"
// 								value={search}
// 								onChange={(e) => setSearch(e.target.value)}
// 								onKeyDown={(e) => { if (e.key === 'Enter' && search.trim()) { router.push(`/shop?q=${encodeURIComponent(search.trim())}`) } }}
// 							/>
// 						</div>
// 					</div>

// 					<nav className="flex gap-8 items-center">
// 						<Link href="/shop" className="nav-link">Shop</Link>
// 						<Link href="/collections" className="nav-link">Collections</Link>
// 						<Link href="/about" className="nav-link">About</Link>
// 						<Link href="/login" className="nav-link">Account</Link>
// 						<Link href="/cart" className="relative">
// 							<ShoppingCart className="w-5 h-5 text-white" />
// 							<span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">{totalItems}</span>
// 						</Link>
// 					</nav>
// 				</div>
// 				<div aria-hidden className="absolute left-0 right-0 -bottom-px h-0.5 bg-linear-to-r from-accent/90 via-accent/60 to-accent/90 shadow-sm" />
// 			</header>

// 			<header className="md:hidden bg-brand-brown text-white border-b border-primary-foreground/10 sticky top-0 z-50 shadow-sm">
// 				<div className="px-4 py-4 flex justify-between items-center">
// 					<Link href="/" className="text-xl font-serif font-light tracking-widest text-white">FlexLeather</Link>
// 					<div className="flex gap-4 items-center">
// 						<Link href="/cart" className="relative">
// 							<ShoppingCart className="w-5 h-5 text-white" />
// 							<span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">{totalItems}</span>
// 						</Link>
// 						<button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu" className="p-2 rounded-md hover:bg-white/10 transition">{isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}</button>
// 					</div>
// 				</div>

// 				{isOpen && (
// 					<nav className="border-t border-border px-4 py-4 space-y-4 backdrop-blur-xl bg-white/5 rounded-b-lg">
// 						<div className="flex items-center border border-border bg-muted px-3 py-2">
// 							<div className="flex items-center border border-border bg-muted/20 px-3 py-2 rounded-md backdrop-blur-sm ring-1 ring-accent/20">
// 								<Search className="w-4 h-4 text-white/90" />
// 								<input type="text" placeholder="Search..." className="flex-1 ml-2 bg-transparent outline-none text-sm placeholder:text-white/70" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && search.trim()) { router.push(`/shop?q=${encodeURIComponent(search.trim())}`) } }} />
// 							</div>
// 						</div>

// 						<Link href="/shop" className="block text-sm font-light tracking-wide text-white hover:text-accent transition">Shop</Link>
// 						<Link href="/collections" className="block text-sm font-light tracking-wide text-white hover:text-accent transition">Collections</Link>
// 						<Link href="/about" className="block text-sm font-light tracking-wide text-white hover:text-accent transition">About</Link>
// 						<Link href="/login" className="block text-sm font-light tracking-wide text-white hover:text-accent transition">Account</Link>
// 					</nav>
// 				)}
// 			</header>
// 		</>
// 	)
// }







'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart, Menu, X, Search } from 'lucide-react'
import { useCart } from '@/components/cart-context'

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
      {/* Desktop Header */}
        <header className="hidden md:block bg-header-leather text-white fixed top-0 w-full z-50 shadow-sm">
        <div className="max-w-7xl container-max px-6 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-serif font-light tracking-widest text-white">FlexLeather</Link>

          <div className="flex-1 mx-8 flex items-center">
            <div className="w-full flex items-center border border-border bg-white/5 px-3 py-2 rounded-md backdrop-blur-sm shadow-sm">
              <Search className="w-4 h-4 text-white/80 cursor-pointer" onClick={() => { if (search) router.push(`/shop?q=${encodeURIComponent(search)}`) }} />
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 ml-2 bg-transparent outline-none text-sm text-white placeholder:text-white/70"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && search.trim()) { router.push(`/shop?q=${encodeURIComponent(search.trim())}`) } }}
              />
            </div>
          </div>

          <nav className="flex gap-8 items-center">
            <Link href="/shop" className="nav-link">Shop</Link>
            <Link href="/collections" className="nav-link">Collections</Link>
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/login" className="nav-link">Account</Link>
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-5 h-5 text-white" />
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">{totalItems}</span>
            </Link>
          </nav>
        </div>
        {/* subtle blurred separator instead of a sharp border */}
        <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, bottom: '-6px', height: '12px', pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(0,0,0,0.18), rgba(0,0,0,0.06), rgba(0,0,0,0.18))', filter: 'blur(6px)' }} />
      </header>

      {/* Mobile Header */}
        <header className="md:hidden bg-header-leather text-white fixed top-0 w-full z-50 shadow-sm">
        <div className="px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-serif font-light tracking-widest text-white">FlexLeather</Link>
          <div className="flex gap-4 items-center">
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-5 h-5 text-white" />
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">{totalItems}</span>
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu" className="p-2 rounded-md hover:bg-white/10 transition">
              {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>

        {isOpen && (
            <nav className="border-t border-border px-4 py-4 space-y-4 bg-brand-brown rounded-b-lg">
            <div className="flex items-center border border-border bg-muted px-3 py-2">
              <div className="flex items-center border border-border bg-muted/20 px-3 py-2 rounded-md backdrop-blur-sm ring-1 ring-accent/20">
                <Search className="w-4 h-4 text-white/90" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 ml-2 bg-transparent outline-none text-sm placeholder:text-white/70"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && search.trim()) { router.push(`/shop?q=${encodeURIComponent(search.trim())}`) } }}
                />
              </div>
            </div>

            <Link href="/shop" className="block text-sm font-light tracking-wide text-white hover:text-accent transition">Shop</Link>
            <Link href="/collections" className="block text-sm font-light tracking-wide text-white hover:text-accent transition">Collections</Link>
            <Link href="/about" className="block text-sm font-light tracking-wide text-white hover:text-accent transition">About</Link>
            <Link href="/login" className="block text-sm font-light tracking-wide text-white hover:text-accent transition">Account</Link>
          </nav>
        )}
      </header>
    </>
  )
}
