import { defineStore } from 'pinia'
import type { CartLine } from './shop'

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

export type Address = { id: number; label: string; city: string; street: string; main: boolean }

/** Mock akkaunt: kirish SMS kod orqali (demo kod sozlamalarda), ma'lumotlar brauzerda saqlanadi. */
export const useAccount = defineStore('account', {
  state: () => ({
    user: null as null | { name: string; phone: string; birthday?: string; lang?: string },
    orders: [] as Order[],
    addresses: [] as Address[],
    seq: 1024
  }),
  getters: { loggedIn: s => !!s.user },
  actions: {
    login(phone: string, name: string) {
      this.user = { name, phone }
    },
    logout() { this.user = null },
    placeOrder(o: Omit<Order, 'id' | 'createdAt' | 'status'>) {
      this.seq += 1
      const order: Order = { ...o, id: String(this.seq), createdAt: new Date().toISOString(), status: 'new' }
      this.orders.unshift(order)
      if (o.address && !this.addresses.some(a => a.street === o.address!.street)) {
        this.addresses.push({ id: Date.now(), label: 'Uy', city: o.address.city, street: o.address.street, main: !this.addresses.length })
      }
      return order
    },
    addAddress(a: Omit<Address, 'id' | 'main'>) {
      this.addresses.push({ ...a, id: Date.now(), main: !this.addresses.length })
    },
    removeAddress(id: number) {
      this.addresses = this.addresses.filter(a => a.id !== id)
      if (this.addresses.length && !this.addresses.some(a => a.main)) this.addresses[0].main = true
    },
    setMain(id: number) { this.addresses.forEach(a => (a.main = a.id === id)) }
  }
})
