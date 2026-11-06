import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], cartTotal: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from backend if authenticated, or from localStorage if guest
  const fetchCart = async () => {
    if (isAuthenticated) {
      setIsLoading(true);
      try {
        const res = await cartService.getCart();
        if (res.success) {
          setCart(res.data);
        }
      } catch (error) {
        console.error('Error fetching cart:', error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      const localCart = localStorage.getItem('shopsphere_guest_cart');
      if (localCart) {
        setCart(JSON.parse(localCart));
      } else {
        setCart({ items: [], cartTotal: 0 });
      }
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (product, quantity = 1) => {
    if (isAuthenticated) {
      try {
        const res = await cartService.addToCart(product._id, quantity);
        if (res.success) {
          setCart(res.data);
          return { success: true };
        }
      } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
      }
    } else {
      // Guest mode
      const items = [...cart.items];
      const existingIndex = items.findIndex((item) => item.product._id === product._id);
      const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;

      if (existingIndex > -1) {
        items[existingIndex].quantity += quantity;
      } else {
        items.push({
          product,
          quantity,
          price: effectivePrice
        });
      }

      const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const updatedCart = { items, cartTotal };
      setCart(updatedCart);
      localStorage.setItem('shopsphere_guest_cart', JSON.stringify(updatedCart));
      return { success: true };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (isAuthenticated) {
      try {
        const res = await cartService.updateQuantity(productId, quantity);
        if (res.success) {
          setCart(res.data);
          return { success: true };
        }
      } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
      }
    } else {
      const items = cart.items.map((item) => {
        if (item.product._id === productId) {
          return { ...item, quantity };
        }
        return item;
      });
      const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const updatedCart = { items, cartTotal };
      setCart(updatedCart);
      localStorage.setItem('shopsphere_guest_cart', JSON.stringify(updatedCart));
      return { success: true };
    }
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        const res = await cartService.removeFromCart(productId);
        if (res.success) {
          setCart(res.data);
          return { success: true };
        }
      } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
      }
    } else {
      const items = cart.items.filter((item) => item.product._id !== productId);
      const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const updatedCart = { items, cartTotal };
      setCart(updatedCart);
      localStorage.setItem('shopsphere_guest_cart', JSON.stringify(updatedCart));
      return { success: true };
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
      } catch (error) {
        console.error('Error clearing cart:', error.message);
      }
    }
    setCart({ items: [], cartTotal: 0 });
    localStorage.removeItem('shopsphere_guest_cart');
  };

  const totalItemCount = cart.items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems: cart.items,
        cartTotal: cart.cartTotal,
        totalItemCount,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

