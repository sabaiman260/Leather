// 'use client'

// import { useEffect, useMemo, useState } from 'react'
// import { apiFetch } from '@/lib/api'
// import Header from '@/components/header'
// import Footer from '@/components/footer'
// import AdminNavbar from '@/components/admin/AdminNavbar'
// import AdminSidebar from '@/components/admin/AdminSidebar'
// import { Button } from '@/components/ui/button'

// type OrderItem = {
//   product: string
//   variant?: string
//   quantity: number
//   price: number
// }

// type Order = {
//   _id: string
//   buyer?: { userName?: string; userEmail?: string }
//   guestDetails?: { fullName?: string }
//   items: OrderItem[]
//   totalAmount: number
//   paymentMethod: 'cod' | 'jazzcash' | 'easypaisa' | 'card'
//   paymentStatus: 'pending' | 'paid' | 'failed'
//   orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
//   createdAt: string
// }

// export default function AdminOrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [search, setSearch] = useState('')
//   const [methodFilter, setMethodFilter] = useState<string>('all')
//   const [statusFilter, setStatusFilter] = useState<string>('all')

//   const loadOrders = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const res = await apiFetch('/api/v1/orders')
//       setOrders(res?.data || [])
//     } catch (e: any) {
//       setError(e?.message || 'Failed to load orders')
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     loadOrders()
//   }, [])

//   const filtered = useMemo(() => {
//     return orders.filter(o => {
//       const mOk = methodFilter === 'all' || o.paymentMethod === methodFilter
//       const sOk = statusFilter === 'all' || o.orderStatus === statusFilter
//       const q = search.trim().toLowerCase()
//       const name = (o.buyer?.userName || o.guestDetails?.fullName || '').toLowerCase()
//       return mOk && sOk && (!q || o._id.toLowerCase().includes(q) || name.includes(q))
//     })
//   }, [orders, methodFilter, statusFilter, search])

//   const markAsPaid = async (order: Order) => {
//     if (order.paymentMethod !== 'cod' || order.paymentStatus !== 'pending') return
//     const ok = window.confirm('Mark this COD order as paid?')
//     if (!ok) return
//     try {
//       await apiFetch(`/api/v1/orders/${order._id}/payment`, {
//         method: 'PUT',
//         body: JSON.stringify({ status: 'paid' })
//       })
//       await loadOrders()
//     } catch (e: any) {
//       alert(e?.message || 'Failed to update payment')
//     }
//   }

//   const updateStatus = async (order: Order, status: Order['orderStatus']) => {
//     const ok = window.confirm(`Update order status to ${status}?`)
//     if (!ok) return
//     try {
//       await apiFetch(`/api/v1/orders/${order._id}/status`, {
//         method: 'PUT',
//         body: JSON.stringify({ status })
//       })
//       await loadOrders()
//     } catch (e: any) {
//       alert(e?.message || 'Failed to update status')
//     }
//   }

//   return (
//     <>
//       <Header />
//       <main className="bg-background min-h-screen">
//         <AdminNavbar />
//         <div className="max-w-7xl mx-auto px-4 md:px-6 pt-16 pb-6 flex gap-6">
//           <AdminSidebar />
//           <div className="flex-1">
//             <h1 className="text-2xl font-serif font-light tracking-wide mb-4">Orders</h1>

//             <div className="flex flex-wrap items-center gap-3 mb-4">
//               <input
//                 className="border border-border px-3 py-2 text-sm"
//                 placeholder="Search by Order ID or Customer"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//               <select
//                 className="border border-border px-3 py-2 text-sm"
//                 value={methodFilter}
//                 onChange={(e) => setMethodFilter(e.target.value)}
//               >
//                 <option value="all">All Methods</option>
//                 <option value="cod">COD</option>
//                 <option value="jazzcash">JazzCash</option>
//                 <option value="easypaisa">EasyPaisa</option>
//                 <option value="card">Card</option>
//               </select>
//               <select
//                 className="border border-border px-3 py-2 text-sm"
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option value="all">All Statuses</option>
//                 <option value="pending">Pending</option>
//                 <option value="processing">Processing</option>
//                 <option value="shipped">Shipped</option>
//                 <option value="delivered">Delivered</option>
//                 <option value="cancelled">Cancelled</option>
//               </select>
//               <Button variant="outline" onClick={loadOrders}>Refresh</Button>
//             </div>

//             {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
//             {loading ? (
//               <p>Loading…</p>
//             ) : (
//               <div className="overflow-x-auto border border-border rounded">
//                 <table className="min-w-full text-sm">
//                   <thead className="bg-muted">
//                     <tr>
//                       <th className="text-left p-3">Order ID</th>
//                       <th className="text-left p-3">Customer</th>
//                       <th className="text-left p-3">Items</th>
//                       <th className="text-left p-3">Total</th>
//                       <th className="text-left p-3">Payment Method</th>
//                       <th className="text-left p-3">Payment Status</th>
//                       <th className="text-left p-3">Order Status</th>
//                       <th className="text-left p-3">Date & Time</th>
//                       <th className="text-left p-3">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filtered.map(order => {
//                       const highlight = order.paymentMethod === 'cod' && order.paymentStatus === 'pending'
//                       return (
//                         <tr key={order._id} className={highlight ? 'bg-yellow-50' : ''}>
//                           <td className="p-3">{order._id}</td>
//                           <td className="p-3">{order.buyer?.userName || order.guestDetails?.fullName || 'Guest'}</td>
//                           <td className="p-3">
//                             {order.items.map(i => `${i.quantity}x ${i.product}`).join(', ')}
//                           </td>
//                           <td className="p-3">${order.totalAmount.toFixed(2)}</td>
//                           <td className="p-3">{order.paymentMethod.toUpperCase()}</td>
//                           <td className="p-3">{order.paymentStatus.toUpperCase()}</td>
//                           <td className="p-3">{order.orderStatus.toUpperCase()}</td>
//                           <td className="p-3">{new Date(order.createdAt).toLocaleString()}</td>
//                           <td className="p-3 space-x-2">
//                             <Button
//                               variant="outline"
//                               disabled={order.paymentMethod !== 'cod' || order.paymentStatus !== 'pending'}
//                               onClick={() => markAsPaid(order)}
//                             >
//                               Mark as Paid
//                             </Button>
//                             <select
//                               className="border border-border px-2 py-1"
//                               value={order.orderStatus}
//                               onChange={(e) => updateStatus(order, e.target.value as Order['orderStatus'])}
//                             >
//                               <option value="pending">Pending</option>
//                               <option value="processing">Processing</option>
//                               <option value="shipped">Shipped</option>
//                               <option value="delivered">Delivered</option>
//                               <option value="cancelled">Cancelled</option>
//                             </select>
//                           </td>
//                         </tr>
//                       )
//                     })}
//                     {filtered.length === 0 && (
//                       <tr>
//                         <td className="p-4 text-center" colSpan={9}>No orders found</td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </>
//   )
// }

'use client'

import { useEffect, useMemo, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Button } from '@/components/ui/button'

type OrderItem = {
  product: string
  variant?: string
  quantity: number
  price: number
}

type Order = {
  _id: string
  buyer?: { userName?: string; userEmail?: string }
  guestDetails?: { fullName?: string }
  items: OrderItem[]
  totalAmount: number
  paymentMethod: 'cod' | 'jazzcash' | 'easypaisa' | 'card'
  paymentStatus: 'pending' | 'paid' | 'failed'
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [methodFilter, setMethodFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const loadOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch('/api/v1/orders')
      setOrders(res?.data || [])
    } catch (e: any) {
      setError(e?.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const filtered = useMemo(() => {
    return orders.filter(o => {
      const mOk = methodFilter === 'all' || o.paymentMethod === methodFilter
      const sOk = statusFilter === 'all' || o.orderStatus === statusFilter
      const q = search.trim().toLowerCase()
      const name = (o.buyer?.userName || o.guestDetails?.fullName || '').toLowerCase()
      return mOk && sOk && (!q || o._id.toLowerCase().includes(q) || name.includes(q))
    })
  }, [orders, methodFilter, statusFilter, search])

  const markAsPaid = async (order: Order) => {
    if (order.paymentMethod !== 'cod' || order.paymentStatus !== 'pending') return
    if (!window.confirm('Mark this COD order as paid?')) return
    try {
      await apiFetch(`/api/v1/orders/${order._id}/payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid' })
      })
      await loadOrders()
    } catch (e: any) {
      alert(e?.message || 'Failed to update payment')
    }
  }

  const updateStatus = async (order: Order, status: Order['orderStatus']) => {
    if (!window.confirm(`Update order status to ${status}?`)) return
    try {
      await apiFetch(`/api/v1/orders/${order._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      await loadOrders()
    } catch (e: any) {
      alert(e?.message || 'Failed to update status')
    }
  }

  return (
    <>
      <h1 className="text-2xl font-serif font-light tracking-wide mb-4">Orders</h1>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          className="border border-border px-3 py-2 text-sm"
          placeholder="Search by Order ID or Customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border border-border px-3 py-2 text-sm"
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
        >
          <option value="all">All Methods</option>
          <option value="cod">COD</option>
          <option value="jazzcash">JazzCash</option>
          <option value="easypaisa">EasyPaisa</option>
          <option value="card">Card</option>
        </select>

        <select
          className="border border-border px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <Button variant="outline" onClick={loadOrders}>Refresh</Button>
      </div>

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="overflow-x-auto border border-border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3">Order ID</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Items</th>
                <th className="text-left p-3">Total</th>
                <th className="text-left p-3">Payment</th>
                <th className="text-left p-3">Pay Status</th>
                <th className="text-left p-3">Order Status</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order._id}>
                  <td className="p-3">{order._id}</td>
                  <td className="p-3">{order.buyer?.userName || order.guestDetails?.fullName || 'Guest'}</td>
                  <td className="p-3">{order.items.map(i => `${i.quantity}x ${i.product}`).join(', ')}</td>
                  <td className="p-3">${order.totalAmount.toFixed(2)}</td>
                  <td className="p-3">{order.paymentMethod.toUpperCase()}</td>
                  <td className="p-3">{order.paymentStatus.toUpperCase()}</td>
                  <td className="p-3">{order.orderStatus.toUpperCase()}</td>
                  <td className="p-3">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="p-3 space-x-2">
                    <Button
                      variant="outline"
                      disabled={order.paymentMethod !== 'cod' || order.paymentStatus !== 'pending'}
                      onClick={() => markAsPaid(order)}
                    >
                      Mark as Paid
                    </Button>
                    <select
                      className="border border-border px-2 py-1"
                      value={order.orderStatus}
                      onChange={(e) => updateStatus(order, e.target.value as Order['orderStatus'])}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-4 text-center">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
