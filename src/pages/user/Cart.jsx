import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout";
import { useCart } from "../../context/CartContext";
import PriceDisplay from "../../components/PriceDisplay";
import EmptyState from "../../components/EmptyState";
import Button from "../../components/ui/Button";

/**
 * Cart page - Midnight Ivory theme
 */
export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-16">
          <EmptyState
            title="Your cart is empty"
            description="Looks like you haven't added any items to your cart yet."
            actionLabel="Start Shopping"
            actionLink="/products"
            variant="cart"
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-serif text-2xl font-semibold text-textDark mb-2">
          Shopping Cart
        </h1>
        <div className="h-px w-16 bg-gold mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-gradient-card rounded-xl shadow-card p-6 flex flex-col sm:flex-row gap-4 border border-border/50 hover:shadow-cardHover transition-shadow"
              >
                <img
                  src={item.images?.[0] || "https://via.placeholder.com/100"}
                  alt={item.name}
                  className="w-full sm:w-28 h-28 object-cover rounded-xl"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-textDark truncate">
                    {item.name}
                  </h3>
                  <p className="text-primary font-medium mt-1">
                    <PriceDisplay amount={item.price} />
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="w-9 h-9 rounded-xl bg-surface hover:bg-primary/10 flex items-center justify-center font-medium transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      disabled={item.quantity >= (item.stock || 99)}
                      className="w-9 h-9 rounded-xl bg-surface hover:bg-primary/10 disabled:opacity-50 flex items-center justify-center font-medium transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <p className="font-semibold text-primary">
                    <PriceDisplay amount={item.price * item.quantity} />
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-danger text-sm font-medium hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:block">
            <div className="bg-gradient-card rounded-xl shadow-card p-6 sticky top-24 border border-border/50">
              <h2 className="font-serif font-semibold text-lg text-textDark mb-4">
                Order Summary
              </h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span className="text-textDark">
                    <PriceDisplay amount={getCartTotal()} />
                  </span>
                </div>
              </div>
              <div className="border-t border-border pt-4 mb-4">
                <div className="flex justify-between font-bold text-lg text-textDark">
                  <span>Total</span>
                  <span className="text-primary">
                    <PriceDisplay amount={getCartTotal()} />
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted mb-4">
                Shipping & taxes calculated at checkout
              </p>
              <Link
                to={isAuthenticated ? "/checkout" : "/login"}
                state={
                  !isAuthenticated ? { from: { pathname: "/checkout" } } : undefined
                }
                className="block"
              >
                <Button variant="primary" size="md" fullWidth>
                  {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile sticky bottom */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-border p-4 shadow-softHover z-30">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div>
              <p className="text-sm text-muted">Total</p>
              <p className="font-bold text-primary text-lg">
                <PriceDisplay amount={getCartTotal()} />
              </p>
            </div>
            <Link
              to={isAuthenticated ? "/checkout" : "/login"}
              state={
                !isAuthenticated ? { from: { pathname: "/checkout" } } : undefined
              }
            >
              <Button variant="primary" size="md">
                {isAuthenticated ? "Checkout" : "Login to Checkout"}
              </Button>
            </Link>
          </div>
        </div>
        <div className="h-20 lg:hidden" />
      </div>
    </Layout>
  );
}
