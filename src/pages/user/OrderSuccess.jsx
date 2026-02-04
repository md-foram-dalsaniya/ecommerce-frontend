import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { getStorage, STORAGE_KEYS } from "../../utils/storage";
import PriceDisplay from "../../components/PriceDisplay";
import { formatDate } from "../../utils/formatters";

/**
 * Order success - tick animation, confirmation message
 */
export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [showTick, setShowTick] = useState(false);

  useEffect(() => {
    const orders = getStorage(STORAGE_KEYS.ORDERS) || [];
    const found = orders.find((o) => o.id === orderId);
    setOrder(found);
    setTimeout(() => setShowTick(true), 100);
  }, [orderId]);

  if (!order) {
    return (
      <Layout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted">Order not found</p>
            <Link
              to="/"
              className="text-primary hover:underline mt-2 inline-block font-medium"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        {/* Success tick animation */}
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 transition-all duration-500 ${showTick ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
          style={{
            background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
            boxShadow: "0 8px 30px rgba(5, 150, 105, 0.3)",
          }}
        >
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="font-serif text-2xl font-semibold text-textDark mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-muted mb-8">
          Thank you for your order. We'll deliver it soon.
        </p>

        <div className="bg-gradient-card rounded-xl shadow-card p-6 text-left mb-8 border border-border/50">
          <p className="font-semibold text-textDark">{order.id}</p>
          <p className="text-sm text-muted mt-1">{formatDate(order.createdAt)}</p>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-textDark">
              <span className="font-medium">Delivery to:</span> {order.address}
            </p>
            <p className="text-lg font-bold mt-2 text-primary">
              <PriceDisplay amount={order.total} />
            </p>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted">
              <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Cash on Delivery (COD)
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/orders"
            className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all"
          >
            View Orders
          </Link>
          <Link
            to="/products"
            className="px-6 py-3 border border-border rounded-xl font-medium hover:bg-background transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </Layout>
  );
}
