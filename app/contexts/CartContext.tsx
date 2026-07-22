'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { MenuItem, CartItem } from '../data/menu'

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: MenuItem, clickPosition?: { x: number; y: number }) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  lastAddToCartPosition: { x: number; y: number } | null
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [lastAddToCartPosition, setLastAddToCartPosition] = useState<{ x: number; y: number } | null>(null)

  const addToCart = (item: MenuItem, clickPosition?: { x: number; y: number }) => {
    setCart((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, cartQuantity: cartItem.cartQuantity + 1 }
            : cartItem
        )
      }
      return [...prev, { ...item, cartQuantity: 1 }]
    })
    
    // Store the click position if provided
    if (clickPosition) {
      setLastAddToCartPosition(clickPosition)
    }
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, cartQuantity: quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.cartQuantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace('₹', '').replace(',', ''))
      return total + price * item.cartQuantity
    }, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        lastAddToCartPosition,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

