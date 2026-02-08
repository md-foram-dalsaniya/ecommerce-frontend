import { createContext, useContext, useState } from "react";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const value = { addToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
};

/* Toast - fixed top-right, slide-down from top, premium styling */
const ToastContainer = ({ toasts }) => (
  <div
    className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full sm:max-w-md pointer-events-none px-4 sm:px-0"
    aria-live="polite"
    aria-label="Notifications"
  >
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-softHover animate-toast-enter ${toast.type === "success"
          ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
          : toast.type === "error"
            ? "bg-red-50 border border-red-200 text-red-800"
            : "bg-blue-50 border border-blue-200 text-blue-800"
          }`}
      >
        {toast.type === "success" ? (
          <svg className="w-5 h-5 flex-shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : toast.type === "error" ? (
          <svg className="w-5 h-5 flex-shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 flex-shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        <span className="text-sm font-medium flex-1">{toast.message}</span>
      </div>
    ))}
  </div>
);
