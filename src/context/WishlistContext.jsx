import { createContext, useContext, useState, useEffect } from "react";
import { getStorage, setStorage, STORAGE_KEYS } from "../utils/storage";

const WishlistContext = createContext(null);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const saved = getStorage(STORAGE_KEYS.WISHLIST);
    if (saved) setWishlistItems(saved);
  }, []);

  // Save wishlist to localStorage when it changes
  useEffect(() => {
    setStorage(STORAGE_KEYS.WISHLIST, wishlistItems);
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      if (prev.find((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const moveToCart = (product, addToCart) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    moveToCart,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
