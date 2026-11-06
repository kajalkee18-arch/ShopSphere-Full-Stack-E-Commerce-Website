import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlist = async () => {
    if (isAuthenticated) {
      setIsLoading(true);
      try {
        const res = await wishlistService.getWishlist();
        if (res.success) {
          setWishlist(res.data);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      const local = localStorage.getItem('shopsphere_guest_wishlist');
      setWishlist(local ? JSON.parse(local) : []);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const toggleWishlist = async (product) => {
    if (isAuthenticated) {
      try {
        const res = await wishlistService.toggleWishlist(product._id);
        if (res.success) {
          setWishlist(res.data);
          return { success: true, message: res.message };
        }
      } catch (error) {
        return { success: false, message: error.message };
      }
    } else {
      const exists = wishlist.some((item) => item._id === product._id);
      let updated;
      let message;
      if (exists) {
        updated = wishlist.filter((item) => item._id !== product._id);
        message = 'Removed from wishlist';
      } else {
        updated = [...wishlist, product];
        message = 'Added to wishlist';
      }
      setWishlist(updated);
      localStorage.setItem('shopsphere_guest_wishlist', JSON.stringify(updated));
      return { success: true, message };
    }
  };

  const isWishlisted = (productId) => {
    return wishlist.some((item) => (item._id || item) === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isLoading,
        toggleWishlist,
        isWishlisted,
        refreshWishlist: fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

