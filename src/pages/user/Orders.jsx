import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getStorage, setStorage, STORAGE_KEYS } from "../../utils/storage";
import PriceDisplay from "../../components/PriceDisplay";
import { formatDate } from "../../utils/formatters";
import EmptyState from "../../components/EmptyState";

const STATUS_COLORS = {
  Placed: "bg-accentBlue/10 text-accentBlue",
  Shipped: "bg-accentBlue/20 text-accentBlue",
  Delivered: "bg-success/10 text-success",
  Cancelled: "bg-danger/10 text-danger",
};

const FILTERS = [
  { value: "all", label: "All" },
  { value: "Delivered", label: "Delivered" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Shipped", label: "Shipped" },
  { value: "Placed", label: "Placed" },
];

export default function Orders() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const allOrders = getStorage(STORAGE_KEYS.ORDERS) || [];
    const userOrders = allOrders.filter((o) => o.userId === user?.id);
    setOrders(userOrders);
    setLoading(false);
  }, [user?.id]);

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const cancelOrder = (orderId) => {
    const allOrders = getStorage(STORAGE_KEYS.ORDERS) || [];
    const updated = allOrders.map((o) =>
      o.id === orderId && o.status === "Placed"
        ? { ...o, status: "Cancelled" }
        : o
    );
    setStorage(STORAGE_KEYS.ORDERS, updated);
    setOrders(updated.filter((o) => o.userId === user?.id));
    addToast("Order cancelled");
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 rounded-xl animate-skeleton" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (orders.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-16">
          <EmptyState
            title="No orders yet"
            description="When you place an order, it will appear here."
            actionLabel="Start Shopping"
            actionLink="/products"
            variant="orders"
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-serif text-2xl font-semibold text-textDark mb-2">
          My Orders
        </h1>
        <div className="h-px w-16 bg-gold mb-8" />

        {/* Filters with gold underline on active */}
        <div className="flex gap-2 mb-6 flex-wrap border-b border-border pb-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all relative ${filter === f.value ? "gold-underline text-primary" : "text-muted hover:text-primary"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-gradient-card rounded-xl shadow-card overflow-hidden border border-border/50 hover:shadow-cardHover transition-shadow"
            >
              <div
                className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cursor-pointer"
                onClick={() =>
                  setExpandedOrder(expandedOrder === order.id ? null : order.id)
                }
              >
                <div>
                  <p className="font-semibold text-textDark">{order.id}</p>
                  <p className="text-sm text-muted">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-xl text-sm font-medium ${STATUS_COLORS[order.status] || "bg-border text-muted"
                      }`}
                  >
                    {order.status}
                  </span>
                  <span className="font-bold text-primary">
                    <PriceDisplay amount={order.total} />
                  </span>
                  <svg
                    className={`w-5 h-5 text-muted transition-transform ${expandedOrder === order.id ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className="border-t border-border px-4 py-4 bg-surface/30">
                  <p className="text-sm mb-2 text-textDark">
                    <span className="font-medium">Address:</span> {order.address}
                  </p>
                  <div className="space-y-2 mb-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm text-textDark"
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>
                          <PriceDisplay amount={item.price * item.quantity} />
                        </span>
                      </div>
                    ))}
                  </div>
                  {order.status === "Placed" && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="px-4 py-2 bg-danger/10 text-danger rounded-xl text-sm font-medium hover:bg-danger/20 transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <p className="text-center text-muted py-8">
            No orders match this filter.
          </p>
        )}
      </div>
    </Layout>
  );
}
