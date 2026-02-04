import { createContext, useContext, useState, useEffect } from "react";
import { getStorage, setStorage, removeStorage, STORAGE_KEYS } from "../utils/storage";
import { ADMIN_EMAIL, ADMIN_PASSWORD, initialProducts, initialCategories } from "../data/mockData";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize data on first load
  useEffect(() => {
    const products = getStorage(STORAGE_KEYS.PRODUCTS);
    const categories = getStorage(STORAGE_KEYS.CATEGORIES);
    if (!products) setStorage(STORAGE_KEYS.PRODUCTS, initialProducts);
    if (!categories) setStorage(STORAGE_KEYS.CATEGORIES, initialCategories);
  }, []);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedAuth = getStorage(STORAGE_KEYS.AUTH);
    if (savedAuth) {
      setUser(savedAuth);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Check admin credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = {
        id: "admin",
        email: ADMIN_EMAIL,
        name: "Admin",
        role: "admin",
      };
      setStorage(STORAGE_KEYS.AUTH, adminUser);
      setUser(adminUser);
      return { success: true, role: "admin" };
    }

    // Check normal users
    const users = getStorage(STORAGE_KEYS.USERS) || [];
    const foundUser = users.find((u) => u.email === email);
    if (foundUser) {
      if (foundUser.password !== password) {
        return { success: false, error: "Invalid password" };
      }
      if (!foundUser.isActive) {
        return { success: false, error: "Account is deactivated" };
      }
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        phone: foundUser.phone,
        addresses: foundUser.addresses || [],
        role: "user",
      };
      setStorage(STORAGE_KEYS.AUTH, userData);
      setUser(userData);
      return { success: true, role: "user" };
    }

    return { success: false, error: "User not found. Please register first." };
  };

  const register = (name, email, password, phone = "") => {
    const users = getStorage(STORAGE_KEYS.USERS) || [];
    if (users.find((u) => u.email === email)) {
      return { success: false, error: "Email already registered" };
    }
    const newUser = {
      id: "user_" + Date.now(),
      name,
      email,
      password,
      phone,
      addresses: [],
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    setStorage(STORAGE_KEYS.USERS, users);
    const userData = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      addresses: [],
      role: "user",
    };
    setStorage(STORAGE_KEYS.AUTH, userData);
    setUser(userData);
    return { success: true };
  };

  const logout = () => {
    removeStorage(STORAGE_KEYS.AUTH);
    setUser(null);
  };

  const updateUserProfile = (updates) => {
    if (!user || user.role === "admin") return;
    const users = getStorage(STORAGE_KEYS.USERS) || [];
    const index = users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      users[index] = { ...users[index], ...updates };
      setStorage(STORAGE_KEYS.USERS, users);
      const userData = {
        ...user,
        ...updates,
      };
      delete userData.password;
      setStorage(STORAGE_KEYS.AUTH, userData);
      setUser(userData);
    }
  };

  const addAddress = (addressData) => {
    if (!user || user.role === "admin") return null;
    const addr = {
      id: "addr_" + Date.now(),
      ...addressData,
      full: `${addressData.street}, ${addressData.city}, ${addressData.state} - ${addressData.pincode}`,
    };
    const addresses = [...(user.addresses || []), addr];
    updateUserProfile({ addresses });
    return addr;
  };

  const editAddress = (addressId, addressData) => {
    if (!user || user.role === "admin") return;
    const addresses = (user.addresses || []).map((a) =>
      a.id === addressId
        ? {
          ...a,
          ...addressData,
          full: `${addressData.street}, ${addressData.city}, ${addressData.state} - ${addressData.pincode}`,
        }
        : a
    );
    updateUserProfile({ addresses });
  };

  const deleteAddress = (addressId) => {
    if (!user || user.role === "admin") return;
    const addresses = (user.addresses || []).filter((a) => a.id !== addressId);
    updateUserProfile({ addresses });
  };

  const value = {
    user,
    loading,
    isAdmin: user?.role === "admin",
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUserProfile,
    addAddress,
    editAddress,
    deleteAddress,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
