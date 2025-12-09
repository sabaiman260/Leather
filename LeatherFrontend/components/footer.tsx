import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Footer() {
  return (
    <footer className="bg-footer-leather text-white">
      <div className="container-max md:px-6 py-16">
        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-serif font-light tracking-widest mb-6 text-white">FlexLeather</h3>
            <p className="text-sm font-light leading-relaxed muted-on-dark text-white">
              Handcrafted luxury leather goods for the discerning individual.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-light tracking-wide mb-4 muted-on-dark text-white">Shop</h4>
            <nav className="space-y-3">
              <Link href="/shop?category=handbags" className="text-sm font-light hover:opacity-100 opacity-80 transition text-white">
                Handbags
              </Link>
              <Link href="/shop?category=wallets" className="text-sm font-light hover:opacity-100 opacity-80 transition block text-white">
                Wallets
              </Link>
              <Link href="/shop?category=travel" className="text-sm font-light hover:opacity-100 opacity-80 transition block text-white">
                Travel
              </Link>
              <Link href="/shop?category=accessories" className="text-sm font-light hover:opacity-100 opacity-80 transition block text-white">
                Accessories
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-light tracking-wide mb-4 muted-on-dark text-white">Customer Service</h4>
            <nav className="space-y-3">
              <Link href="/contact" className="text-sm font-light hover:opacity-100 opacity-80 transition block text-white">
                Contact Us
              </Link>
              <Link href="/shipping-returns" className="text-sm font-light hover:opacity-100 opacity-80 transition block text-white">
                Shipping & Returns
              </Link>
              <Link href="/faq" className="text-sm font-light hover:opacity-100 opacity-80 transition block text-white">
                FAQ
              </Link>
              <Link href="/privacy-policy" className="text-sm font-light hover:opacity-100 opacity-80 transition block text-white">
                Privacy Policy
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-light tracking-wide mb-4 muted-on-dark text-white">Contact</h4>
            <div className="space-y-3 text-sm font-light">
              <div className="flex items-center gap-2 opacity-80 text-white">
                <Phone className="w-4 h-4" />
                <span>+923003395535</span>
              </div>
              <div className="flex items-center gap-2 opacity-80 text-white">
                <Mail className="w-4 h-4" />
                <span>info@flexleather.com</span>
              </div>
              <div className="flex items-start gap-2 opacity-80 text-white">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Maverick Engineers G-13<br />Innovista Rachna DHA Gujranwala Pakistan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-primary-foreground/20 pt-12 mb-12">
          <h3 className="text-sm font-light tracking-wide mb-4 muted-on-dark">Subscribe to get latest updates and exclusive offers</h3>
          <div className="flex gap-2 flex-col md:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-white/5 border border-primary-foreground/20 text-sm font-light outline-none placeholder:text-white/60 text-white"
            />
            <Button className="btn-smooth bg-accent hover:bg-accent/90 text-accent-foreground font-light">
              Subscribe
            </Button>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-light opacity-75">
          <p>&copy; 2025 FlexLeather. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:opacity-100">Instagram</Link>
            <Link href="#" className="hover:opacity-100">Facebook</Link>
            <Link href="#" className="hover:opacity-100">Twitter</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
