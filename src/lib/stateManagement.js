import { create } from 'zustand'

// Helper function to load state from local storage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('cartState')
    if (serializedState === null) {
      return { cart: [], totalAmount: 0 }
    }
    return JSON.parse(serializedState)
  } catch (err) {
    return { cart: [], totalAmount: 0 }
  }
}

// Helper function to save state to local storage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('cartState', serializedState)
  } catch (err) {
    // Ignore write errors
  }
}

export const useStore = create((set) => ({
  ...loadState(),
  addToCart: (product) =>
    set((state) => {
      const existingItemIndex = state.cart.findIndex(
        (item) => item.itemId === product.itemId
      )

      let updatedCart, totalAmount
      if (existingItemIndex !== -1) {
        updatedCart = [...state.cart]
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          price: updatedCart[existingItemIndex].price + product.price,
          qty: updatedCart[existingItemIndex].qty + 1,
        }
        totalAmount = state.totalAmount + product.price
      } else {
        const cartItem = { ...product, qty: 1 }
        updatedCart = [...state.cart, cartItem]
        totalAmount = state.totalAmount + cartItem.price
      }

      const newState = { cart: updatedCart, totalAmount }
      saveState(newState)
      return newState
    }),

  removeFromCart: (product) =>
    set((state) => {
      const existingItemIndex = state.cart.findIndex(
        (item) => item.itemId === product.itemId
      )

      if (existingItemIndex !== -1) {
        const updatedCart = [...state.cart]
        const itemToRemove = updatedCart[existingItemIndex]
        let totalAmount

        if (itemToRemove.qty > 1) {
          // If there are multiple instances of the item, decrease its price accordingly
          const priceReduction = itemToRemove.price / itemToRemove.qty
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            price: updatedCart[existingItemIndex].price - priceReduction,
            qty: updatedCart[existingItemIndex].qty - 1,
          }
          // Subtract the price reduction from the total amount
          totalAmount = state.totalAmount - priceReduction
        } else {
          // If there's only one instance of the item, remove it from the cart
          updatedCart.splice(existingItemIndex, 1)
          // Subtract the price of the item removed from the total amount
          totalAmount = state.totalAmount - itemToRemove.price
        }

        const newState = { cart: updatedCart, totalAmount }
        saveState(newState)
        return newState
      }
      return state // If item doesn't exist in cart, return current state
    }),

  clearCart: () =>
    set(() => {
      localStorage.removeItem('cartState')
      const newState = { cart: [], totalAmount: 0 }
      saveState(newState)
      return newState
    }),
}))

// Restore state on initialization
useStore.setState(loadState())
