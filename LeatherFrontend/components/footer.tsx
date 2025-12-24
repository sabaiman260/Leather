// import Link from 'next/link'
// import { Mail, MapPin, Phone } from 'lucide-react'
// import { Button } from '@/components/ui/button'

// export default function Footer() {
//   return (
//     <footer className="bg-footer-leather text-white">
//       <div className="container-max md:px-6 py-16">
//         {/* Footer Content Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
//           {/* Brand */}
//           <div>
//             <h3 className="text-xl font-serif font-light tracking-widest mb-6 text-white">FlexLeather</h3>
//             <p className="text-sm font-light leading-relaxed muted-on-dark text-white">
//               Handcrafted luxury leather goods for the discerning individual.
//             </p>
//           </div>

//           {/* Shop */}
//           <div>
//             <h4 className="text-sm font-light tracking-wide mb-4 muted-on-dark text-white">Shop</h4>
//             <nav className="space-y-3">
//               <Link href="/shop?category=handbags" className="text-sm font-light hover:opacity-100 opacity-80 transition text-white">
//                 Handbags
//               </Link>
//               <Link href="/shop?category=wallets" className="text-sm font-light hover:opacity-100 opacity-80 transition block text-white">
//                 Wallets
//               </Link>
//               <Link href="/shop?category=travel" className="text-sm font-light hover:opacity-100 opacity-80 transition block text-white">
//                 Travel
//               </Link>
//               <Link href="/shop?category=accessories" className="text-sm font-light hover:opacity-100 opacity-80 transition block text-white">
//                 Accessories
//               </Link>
//             </nav>
//           </div>

//           {/* Customer Service */}
//           <div>
//             <h4 className="text-sm font-light tracking-wide mb-4 muted-on-dark text-white">Customer Service</h4>
//             <nav className="space-y-3">
//               <Link href="/contact" className="text-sm font-light hover:opacity-100 opacity-80 transition block text-white">
//                 Contact Us
//               </Link>
//               <Link href="/shipping-returns" className="text-sm font-light hover:opacity-100 opacity-80 transition block text-white">
//                 Shipping & Returns
//               </Link>
//               <Link href="/faq" className="text-sm font-light hover:opacity-100 opacity-80 transition block text-white">
//                 FAQ
//               </Link>
//               <Link href="/privacy-policy" className="text-sm font-light hover:opacity-100 opacity-80 transition block text-white">
//                 Privacy Policy
//               </Link>
//             </nav>
//           </div>

//           {/* Contact */}
//           <div>
//             <h4 className="text-sm font-light tracking-wide mb-4 muted-on-dark text-white">Contact</h4>
//             <div className="space-y-3 text-sm font-light">
//               <div className="flex items-center gap-2 opacity-80 text-white">
//                 <Phone className="w-4 h-4" />
//                 <span>+923003395535</span>
//               </div>
//               <div className="flex items-center gap-2 opacity-80 text-white">
//                 <Mail className="w-4 h-4" />
//                 <span>info@flexleather.com</span>
//               </div>
//               <div className="flex items-start gap-2 opacity-80 text-white">
//                 <MapPin className="w-4 h-4 mt-0.5" />
//                 <span>Maverick Engineers G-13<br />Innovista Rachna DHA Gujranwala Pakistan</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Newsletter Signup */}
//         <div className="border-t border-primary-foreground/20 pt-12 mb-12">
//           <h3 className="text-sm font-light tracking-wide mb-4 muted-on-dark">Subscribe to get latest updates and exclusive offers</h3>
//           <div className="flex gap-2 flex-col md:flex-row">
//             <input
//               type="email"
//               placeholder="Enter your email"
//               className="flex-1 px-4 py-2 bg-white/5 border border-primary-foreground/20 text-sm font-light outline-none placeholder:text-white/60 text-white"
//             />
//             <Button className="btn-smooth bg-accent hover:bg-accent/90 text-accent-foreground font-light">
//               Subscribe
//             </Button>
//           </div>
//         </div>

//         {/* Bottom Footer */}
//         <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-light opacity-75">
//           <p>&copy; 2025 FlexLeather. All rights reserved.</p>
//           <div className="flex gap-6 mt-4 md:mt-0">
//             <Link href="#" className="hover:opacity-100">Instagram</Link>
//             <Link href="#" className="hover:opacity-100">Facebook</Link>
//             <Link href="#" className="hover:opacity-100">Twitter</Link>
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }

import Link from 'next/link'
import { Mail, MapPin, Phone, Facebook, Instagram, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Footer() {
  return (
    <footer className="bg-footer-leather text-white">
      <div className="container-max md:px-6 py-16">

        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div>
            <h3 className="text-xl font-serif font-light tracking-widest mb-6">
              FlexLeather
            </h3>
            <p className="text-sm font-light leading-relaxed opacity-80">
              Handcrafted luxury leather goods for the discerning individual.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-light tracking-wide mb-4">
              Shop
            </h4>
            <nav className="space-y-3">
              <Link href="/shop?category=handbags" className="block text-sm font-light opacity-80 hover:opacity-100">
                Handbags
              </Link>
              <Link href="/shop?category=wallets" className="block text-sm font-light opacity-80 hover:opacity-100">
                Wallets
              </Link>
              <Link href="/shop?category=travel" className="block text-sm font-light opacity-80 hover:opacity-100">
                Travel
              </Link>
              <Link href="/shop?category=accessories" className="block text-sm font-light opacity-80 hover:opacity-100">
                Accessories
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-light tracking-wide mb-4">
              Customer Service
            </h4>
            <nav className="space-y-3">
              <Link href="/contact" className="block text-sm font-light opacity-80 hover:opacity-100">
                Contact Us
              </Link>
              <Link href="/shipping-returns" className="block text-sm font-light opacity-80 hover:opacity-100">
                Shipping & Returns
              </Link>
              <Link href="/faq" className="block text-sm font-light opacity-80 hover:opacity-100">
                FAQ
              </Link>
              <Link href="/privacy-policy" className="block text-sm font-light opacity-80 hover:opacity-100">
                Privacy Policy
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-light tracking-wide mb-4">
              Contact
            </h4>
            <div className="space-y-3 text-sm font-light opacity-80">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+92 300 3395535</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@flexleather.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>
                  Maverick Engineers G-13<br />
                  Innovista Rachna DHA<br />
                  Gujranwala, Pakistan
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Newsletter */}
        <div className="border-t border-white/20 pt-12 mb-12">
          <h3 className="text-sm font-light tracking-wide mb-4 opacity-80">
            Subscribe to get latest updates and exclusive offers
          </h3>
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-white/5 border border-white/20 text-sm font-light outline-none placeholder:text-white/60"
            />
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-light">
              Subscribe
            </Button>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-light opacity-75">

          <p>© {new Date().getFullYear()} FlexLeather. All rights reserved.</p>

          {/* Social Links */}
          <div className="flex gap-6 mt-4 md:mt-0">
            <a
              href="https://www.instagram.com/flexleather.official/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:opacity-100 transition"
            >
              <Instagram className="w-5 h-5" />
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=61585260157289"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:opacity-100 transition"
            >
              <Facebook className="w-5 h-5" />
            </a>

            <a
              href="https://twitter.com/flexleather"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:opacity-100 transition"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  )
}
