import { createContext, useContext, useState, useEffect } from "react";
import { getStorage, setStorage } from "../utils/storage";

const CURRENCY_KEY = "ecommerce_currency";
const INR_TO_USD = 1 / 83; // 1 USD = 83 INR

const CurrencyContext = createContext(null);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("INR");

  useEffect(() => {
    const saved = getStorage(CURRENCY_KEY);
    if (saved === "USD" || saved === "INR") setCurrency(saved);
  }, []);

  const toggleCurrency = () => {
    const next = currency === "INR" ? "USD" : "INR";
    setCurrency(next);
    setStorage(CURRENCY_KEY, next);
  };

  const convertAmount = (amountInr) => {
    if (currency === "INR") return amountInr;
    return Math.round(amountInr * INR_TO_USD * 100) / 100;
  };

  const formatAmount = (amountInr) => {
    const amount = convertAmount(amountInr);
    if (currency === "INR") {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(amount);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const value = {
    currency,
    toggleCurrency,
    convertAmount,
    formatAmount,
    isINR: currency === "INR",
  };

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
};
