import { defineStore } from 'pinia'
import type { CartLine } from './shop'

// Kabinet yo'q: buyurtmalar faqat "rahmat" sahifasini ko'rsatish uchun brauzerda saqlanadi.
// Backend kelganda POST /orders javobi shu formatda bo'ladi.
export type Order = {
  id: string
  createdAt: string
  status: 'new' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled'
  lines: Array<CartLine & { name: string; brand: string; price: number }>
  subtotal: number
  delivery: number
  discount: number
  total: number
  method: 'delivery' | 'pickup'
  payment: 'cash' | 'card'
  customer: { name: string; phone: string; phone2?: string }
  address?: { city: string; street: string; note?: string }
  branch?: string
}

export const useOrders = defineStore('orders', {
  state: () => ({ orders: [] as Order[], seq: 1024 }),
  actions: {
    placeOrder(o: Omit<Order, 'id' | 'createdAt' | 'status'>) {
      this.seq += 1
      const order: Order = { ...o, id: String(this.seq), createdAt: new Date().toISOString(), status: 'new' }
      this.orders = [order, ...this.orders].slice(0, 20)
      return order
    }
  }
})
