/**
 * LocalStorage utility functions
 * Handles all localStorage operations for the app
 */

const STORAGE_KEYS = {
  AUTH: "ecommerce_auth",
  USERS: "ecommerce_users",
  PRODUCTS: "ecommerce_products",
  CATEGORIES: "ecommerce_categories",
  ORDERS: "ecommerce_orders",
  CART: "ecommerce_cart",
  WISHLIST: "ecommerce_wishlist",
};

// Get item from localStorage
export const getStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
};

// Set item in localStorage
export const setStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("Error writing to localStorage:", error);
    return false;
  }
};

// Remove item from localStorage
export const removeStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Error removing from localStorage:", error);
    return false;
  }
};

export { STORAGE_KEYS };
