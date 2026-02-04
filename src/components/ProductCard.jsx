import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import PriceDisplay from "./PriceDisplay";
import StarRating from "./StarRating";

/**
 * Product card - Midnight Ivory theme
 * Card gradient, gold on hover, soft shadows
 */
export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();
  const inWishlist = isInWishlist(product.id);
  const outOfStock = product.stock === 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (outOfStock) return;
    addToCart(product, 1);
    addToast("Added to cart!");
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
      addToast("Removed from wishlist");
    } else {
      addToWishlist(product);
      addToast("Added to wishlist!");
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="bg-gradient-card rounded-xl shadow-card overflow-hidden hover:shadow-cardHover hover:-translate-y-0.5 transition-all duration-300 relative border border-border/50">
        {/* Out of Stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-textDark/50 z-10 flex items-center justify-center">
            <span className="bg-danger text-white px-4 py-2 rounded-xl font-semibold text-sm">
              Out of Stock
            </span>
          </div>
        )}

        {/* Image */}
        <div className="aspect-square bg-surface relative overflow-hidden">
          <img
            src={product.images?.[0] || "https://via.placeholder.com/300"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 bg-white/95 rounded-xl shadow-soft hover:bg-gold/20 z-20 transition-all duration-300"
          >
            <svg
              className={`w-5 h-5 transition-colors ${inWishlist ? "text-danger fill-current" : "text-muted"}`}
              fill={inWishlist ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Content - divider between image & content */}
        <div className="p-4 border-t border-border/50">
          <p className="text-xs text-muted mb-1">{product.category}</p>
          <h3 className="font-serif font-semibold text-textDark truncate group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="mt-2">
            <StarRating rating={product.rating ?? 4} reviewCount={product.reviewCount ?? 12} />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              <PriceDisplay amount={product.price} />
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-muted line-through">
                <PriceDisplay amount={product.originalPrice} />
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="mt-3 w-full py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.98]"
          >
            {outOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </Link>
  );
}
