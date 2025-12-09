'use client'

"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCart } from '@/components/cart-context'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [zip, setZip] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cod'|'card'>('cod')

  const placeOrder = () => {
    const order = {
      id: `AL-${Date.now()}`,
      date: new Date().toISOString(),
      items,
      total: totalPrice,
      paymentMethod,
      customer: { name, email, address, city, zip }
    }
    try {
      localStorage.setItem('flexleather_order', JSON.stringify(order))
    } catch (e) {
      // ignore
    }
    clearCart()
    router.push('/order-confirmation')
  }
  return (
    <>
      <Header />
      <main className="bg-background min-h-screen">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-serif font-light tracking-wide mb-12">
            Checkout
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-8">
              {/* Shipping Address */}
              <div className="border-b border-border pb-8">
                <h2 className="text-lg font-light tracking-wide mb-6">Shipping Address</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-light mb-2">Full Name</label>
                    <input
                      type="text"
                      className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-accent transition"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-light mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-accent transition"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-light mb-2">Address</label>
                    <input
                      type="text"
                      className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-accent transition"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-light mb-2">City</label>
                      <input
                        type="text"
                        className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-accent transition"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light mb-2">ZIP Code</label>
                      <input
                        type="text"
                        className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-accent transition"
                        placeholder="10001"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-lg font-light tracking-wide mb-6">Payment Method</h2>
                <div className="border border-accent p-6 mb-4">
                  <fieldset>
                    <legend className="sr-only">Payment Method</legend>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3">
                        <input aria-label="Cash on Delivery" title="Cash on Delivery" type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} readOnly />
                        <span>Cash on Delivery (COD) — pay when you receive your order</span>
                      </label>
                    </div>
                  </fieldset>
                </div>
                {/* Only COD available in this demo */}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="border border-border p-8 sticky top-24">
                <h2 className="text-lg font-light tracking-wide mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-serif mb-8">
                  <span>Total</span>
                  <span>$0.00</span>
                </div>

                <Button onClick={placeOrder} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={items.length === 0 || !name || !email || !address || paymentMethod !== 'cod'}>
                  Place Order
                </Button>

                <Link href="/shop">
                  <Button variant="outline" className="w-full mt-3">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
