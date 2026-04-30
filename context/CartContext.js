'use client';

// Cart now stores the full product object alongside quantity.
// This means the cart works correctly whether products came from the API or static data.
// Shape of each cart item: { product: {...}, quantity: number }

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);   // [{ product, quantity }]
  const [mounted, setMounted] = useState(false);

  // Restore cart from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('zenvy_cart');
      if (saved) setCartItems(JSON.parse(saved));
    } catch {}
    setMounted(true);
  }, []);

  // Persist whenever cart changes (after mount)
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('zenvy_cart', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems, mounted]);

  // product = full product object from API (has _id, name, price, images...)
  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Returns the same shape the rest of the UI already expects
  const getCartProducts = () => cartItems;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        getCartProducts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
