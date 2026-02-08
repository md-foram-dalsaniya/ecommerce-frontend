import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import ProductCard from "../../components/ProductCard";
import { getStorage, STORAGE_KEYS } from "../../utils/storage";

/**
 * Home page - Midnight Ivory theme
 * Hero with primary gradient, featured products, categories
 */
export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const prods = getStorage(STORAGE_KEYS.PRODUCTS) || [];
    const cats = getStorage(STORAGE_KEYS.CATEGORIES) || [];
    setProducts(prods.filter((p) => p.isActive).slice(0, 8));
    setCategories(cats.filter((c) => c.isActive));
    setLoading(false);
  }, []);

  return (
    <Layout>
      {/* Hero - primary gradient */}
      <div className="bg-gradient-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-4">
            Welcome to ShopEase
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl">
            Discover quality products at great prices. Shop with confidence with
            Cash on Delivery.
          </p>
          <Link
            to="/products"
            className="inline-block px-8 py-3.5 bg-white text-primary font-semibold rounded-xl hover:bg-white/90 transition-all duration-300 shadow-soft active:scale-[0.98]"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Categories - compact, premium */}
      {categories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="font-serif text-xl font-semibold text-textDark inline-block">
            Shop by Category
          </h2>
          <div className="h-px w-10 bg-gold mt-2 mb-8" />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center justify-center py-4 px-3 sm:py-5 sm:px-4 rounded-xl bg-white border border-border/60 shadow-soft hover:shadow-cardHover hover:-translate-y-0.5 hover:border-gold/40 transition-all duration-300"
              >
                <span className="text-sm sm:text-base font-medium text-textDark group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
                <span className="block mx-auto mt-2 h-0.5 w-0 bg-gold group-hover:w-8 transition-all duration-300 rounded-full" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="font-serif text-2xl font-semibold text-textDark mb-6">
          Featured Products
        </h2>
        <div className="h-px w-12 bg-gold mb-8" />
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 rounded-xl animate-skeleton" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <Link
            to="/products"
            className="inline-block px-6 py-3 border-2 border-primary text-primary font-medium rounded-xl hover:bg-primary/5 transition-all duration-300"
          >
            View All Products
          </Link>
        </div>
      </div>
    </Layout>
  );
}
