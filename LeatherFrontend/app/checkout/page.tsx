'use client'

"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCart } from '@/components/cart-context'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { apiFetch } from '@/lib/api'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [zip, setZip] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cod'|'jazzcash'|'easypaisa'|'card'>('cod')

  const placeOrder = async () => {
    // Basic validation
    if (!name || !email || !address || !city || !zip) {
      alert('Please fill all shipping fields')
      return
    }
    if (paymentMethod !== 'cod' && (!email || !phone)) {
      alert('Email and phone are required for online payment')
      return
    }

    const guestDetails = {
      fullName: name,
      email,
      phone,
      address: `${address}, ${city}, ${zip}`
    }

    const orderItems = items.map(i => ({
      productId: i.id,
      quantity: i.quantity,
      price: i.price
    }))

    try {
      const res = await apiFetch('/api/v1/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: orderItems,
          totalAmount: totalPrice,
          paymentMethod,
          guestDetails
        })
      })
      const order = res?.data

      // Initiate payment for online methods
      if (paymentMethod !== 'cod') {
        try {
          await apiFetch('/api/v1/payments', {
            method: 'POST',
            body: JSON.stringify({
              orderId: order?._id,
              method: paymentMethod,
              amount: totalPrice
            })
          })
          alert('Payment initiated. You will receive a confirmation once processed.')
        } catch (e: any) {
          alert(e?.message || 'Failed to initiate payment')
        }
      }

      try {
        localStorage.setItem('flexleather_order', JSON.stringify({
          id: order?._id || `AL-${Date.now()}`,
          date: new Date().toISOString(),
          items,
          total: totalPrice,
          paymentMethod,
          customer: { name, email, address, city, zip }
        }))
      } catch {}

      clearCart()
      router.push('/order-confirmation')
    } catch (e: any) {
      alert(e?.message || 'Failed to place order')
    }
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
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-light mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-accent transition"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-light mb-2">Phone</label>
                    <input
                      type="tel"
                      className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-accent transition"
                      placeholder="+92 3XX XXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-light mb-2">Address</label>
                    <input
                      type="text"
                      className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-accent transition"
                      placeholder="123 Main Street"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-light mb-2">City</label>
                      <input
                        type="text"
                        className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-accent transition"
                        placeholder="New York"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light mb-2">ZIP Code</label>
                      <input
                        type="text"
                        className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-accent transition"
                        placeholder="10001"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
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
                        <input
                          aria-label="Cash on Delivery"
                          title="Cash on Delivery"
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                        />
                        <span>Cash on Delivery (COD) — pay when you receive your order</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          aria-label="JazzCash"
                          title="JazzCash"
                          type="radio"
                          name="payment"
                          value="jazzcash"
                          checked={paymentMethod === 'jazzcash'}
                          onChange={() => setPaymentMethod('jazzcash')}
                        />
                        <span>JazzCash — pay via mobile wallet or debit card</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          aria-label="EasyPaisa"
                          title="EasyPaisa"
                          type="radio"
                          name="payment"
                          value="easypaisa"
                          checked={paymentMethod === 'easypaisa'}
                          onChange={() => setPaymentMethod('easypaisa')}
                        />
                        <span>EasyPaisa — secure mobile wallet payment</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          aria-label="Credit/Debit Card"
                          title="Credit/Debit Card"
                          type="radio"
                          name="payment"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                        />
                        <span>Credit/Debit Card — processed securely via gateway</span>
                      </label>
                    </div>
                  </fieldset>
                </div>
                {/* Online payments redirect after server-side processing */}
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
                  <span>${totalPrice.toFixed(2)}</span>
                </div>

                <Button onClick={placeOrder} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={items.length === 0 || !name || !email || !address}>
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
