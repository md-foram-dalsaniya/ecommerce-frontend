import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../../components/Layout";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getStorage, STORAGE_KEYS } from "../../utils/storage";
import PriceDisplay from "../../components/PriceDisplay";
import StarRating from "../../components/StarRating";
import ProductCard from "../../components/ProductCard";

/**
 * Product detail - Midnight Ivory theme
 * Large gallery (swipeable on mobile), sticky Add to Cart on mobile
 * Recommended products below
 */
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const inWishlist = product ? isInWishlist(product.id) : false;
  const outOfStock = product?.stock === 0;

  useEffect(() => {
    const products = getStorage(STORAGE_KEYS.PRODUCTS) || [];
    const found = products.find((p) => p.id === id);
    setProduct(found);
  }, [id]);

  const handleAddToCart = () => {
    if (outOfStock) return;
    addToCart(product, quantity);
    addToast("Added to cart!");
  };

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      addToast("Removed from wishlist");
    } else {
      addToWishlist(product);
      addToast("Added to wishlist!");
    }
  };

  const handleNotifyMe = () => {
    addToast("We'll notify you when this item is back in stock!");
  };

  // Swipe for mobile
  const handleTouchStart = (e) => {
    touchStart.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    const images = product?.images?.length ? product.images : [];
    if (images.length < 2) return;
    const diff = touchStart.current - touchEnd.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setSelectedImage((i) => Math.min(images.length - 1, i + 1));
      } else {
        setSelectedImage((i) => Math.max(0, i - 1));
      }
    }
  };

  const getRecommendedProducts = () => {
    const products = getStorage(STORAGE_KEYS.PRODUCTS) || [];
    return products
      .filter((p) => p.isActive && p.id !== product?.id)
      .slice(0, 6);
  };

  if (!product) {
    return (
      <Layout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl w-full px-4">
            <div className="aspect-square rounded-xl animate-skeleton" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded animate-skeleton" />
              <div className="h-6 w-1/2 rounded animate-skeleton" />
              <div className="h-4 w-full rounded animate-skeleton" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const images =
    product.images?.length ? product.images : ["https://via.placeholder.com/500"];
  const recommended = getRecommendedProducts();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="text-primary hover:underline mb-6 flex items-center gap-1 font-medium transition-colors"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery - swipeable on mobile */}
          <div
            className="touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="aspect-square bg-surface rounded-xl overflow-hidden mb-4 border border-border">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? "border-gold" : "border-border"
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm text-muted mb-1">{product.category}</p>
            <h1 className="font-serif text-3xl font-semibold text-textDark mb-4">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mb-4">
              <StarRating
                rating={product.rating ?? 4}
                reviewCount={product.reviewCount ?? 24}
                size="lg"
              />
            </div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-bold text-primary">
                <PriceDisplay amount={product.price} />
              </span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-muted line-through">
                  <PriceDisplay amount={product.originalPrice} />
                </span>
              )}
            </div>
            <p className="text-muted mb-6">{product.description}</p>
            <p className="text-sm mb-6">
              Stock:{" "}
              <span
                className={
                  outOfStock ? "text-danger font-semibold" : "text-success"
                }
              >
                {outOfStock ? "Out of Stock" : `${product.stock} available`}
              </span>
            </p>

            {!outOfStock && (
              <div className="flex items-center gap-4 mb-6">
                <label className="text-sm font-medium text-textDark">
                  Quantity:
                </label>
                <div className="flex items-center border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-surface transition-colors"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="px-4 py-2 hover:bg-surface transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              {outOfStock ? (
                <button
                  onClick={handleNotifyMe}
                  className="flex-1 py-3.5 border-2 border-primary text-primary rounded-xl font-medium hover:bg-primary/5 transition-all duration-300 active:scale-[0.99]"
                >
                  Notify Me
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all duration-300 active:scale-[0.99]"
                >
                  Add to Cart
                </button>
              )}
              <button
                onClick={handleWishlist}
                className="p-3.5 border border-border rounded-xl hover:bg-surface hover:border-gold transition-all"
              >
                <svg
                  className={`w-6 h-6 transition-colors ${inWishlist ? "text-danger fill-current" : "text-muted"
                    }`}
                  fill={inWishlist ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Recommended Products - below product details */}
        {recommended.length > 0 && (
          <div className="mt-16 pt-12 border-t border-border">
            <h2 className="font-serif text-xl font-semibold text-textDark mb-6">
              Recommended for You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {recommended.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Mobile Sticky Add to Cart Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-border p-4 shadow-softHover z-30">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <p className="text-sm text-muted">Total</p>
              <p className="font-bold text-primary text-lg">
                {outOfStock ? "—" : <PriceDisplay amount={product.price * quantity} />}
              </p>
            </div>
            {outOfStock ? (
              <button
                onClick={handleNotifyMe}
                className="px-8 py-3 border-2 border-primary text-primary rounded-xl font-medium hover:bg-primary/5 transition-all"
              >
                Notify Me
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
        <div className="h-20 lg:hidden" />
      </div>
    </Layout>
  );
}
