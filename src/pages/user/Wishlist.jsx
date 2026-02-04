import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import PriceDisplay from "../../components/PriceDisplay";
import EmptyState from "../../components/EmptyState";
import Button from "../../components/ui/Button";

/**
 * Wishlist page - Midnight Ivory theme
 */
export default function Wishlist() {
  const { wishlistItems, removeFromWishlist, moveToCart } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleMoveToCart = (product) => {
    if (product.stock === 0) {
      addToast("Product is out of stock", "error");
      return;
    }
    moveToCart(product, addToCart);
    addToast("Moved to cart!");
  };

  if (wishlistItems.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-16">
          <EmptyState
            title="Your wishlist is empty"
            description="Save items you like by adding them to your wishlist."
            actionLabel="Browse Products"
            actionLink="/products"
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-serif text-2xl font-semibold text-textDark mb-2">
          Wishlist
        </h1>
        <div className="h-px w-16 bg-gold mb-8" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-gradient-card rounded-xl shadow-card overflow-hidden border border-border/50 hover:shadow-cardHover hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <Link to={`/products/${item.id}`}>
                <div className="aspect-square bg-surface relative overflow-hidden">
                  <img
                    src={item.images?.[0] || "https://via.placeholder.com/300"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.stock === 0 && (
                    <div className="absolute inset-0 bg-textDark/50 flex items-center justify-center">
                      <span className="bg-danger text-white px-3 py-1 rounded-xl text-sm font-medium">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4 border-t border-border/50">
                  <h3 className="font-serif font-semibold text-textDark truncate group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-primary font-medium mt-1">
                    <PriceDisplay amount={item.price} />
                  </p>
                </div>
              </Link>
              <div className="p-4 pt-0 flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleMoveToCart(item)}
                  disabled={item.stock === 0}
                >
                  Add to Cart
                </Button>
                <button
                  onClick={() => {
                    removeFromWishlist(item.id);
                    addToast("Removed from wishlist");
                  }}
                  className="p-2 border border-border rounded-xl hover:border-danger hover:bg-danger/5 text-danger transition-all"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
