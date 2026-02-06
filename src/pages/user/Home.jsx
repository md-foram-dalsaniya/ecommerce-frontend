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

      {/* Categories */}
      {categories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="font-serif text-3xl font-semibold text-textDark mb-3">
              Shop by Category
            </h2>
            <p className="text-muted text-lg">
              Explore our curated collection of premium products
            </p>
            <div className="h-1 w-16 bg-gradient-gold rounded-full mt-4" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-2xl transition-all duration-500">
                  {/* Background gradient card */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-surface to-background opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Main Card */}
                  <div className="relative bg-white border-2 border-border/60 rounded-2xl p-6 md:p-8 shadow-card hover:shadow-cardHover hover:-translate-y-1 transition-all duration-300 text-center h-full flex flex-col items-center justify-center min-h-[180px] md:min-h-[200px] group-hover:border-gold/40 group-hover:bg-gradient-to-br group-hover:from-gold/5 group-hover:to-transparent">
                    
                    {/* Icon Container - Cart-like appearance */}
                    <div className="mb-4 p-4 md:p-5 bg-gradient-to-br from-primary/10 to-accentBlue/10 rounded-2xl group-hover:from-gold/20 group-hover:to-gold/10 transition-all duration-300 transform group-hover:scale-110">
                      <svg
                        className="w-8 h-8 md:w-10 md:h-10 text-primary group-hover:text-gold transition-colors duration-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-0.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l0.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-0.9-2-2-2z" />
                      </svg>
                    </div>
                    
                    {/* Category Name */}
                    <h3 className="font-serif text-lg md:text-xl font-semibold text-textDark group-hover:text-primary transition-colors duration-300 mb-2">
                      {cat.name}
                    </h3>
                    
                    {/* Hover Arrow Indicator */}
                    <div className="inline-block mt-2 p-2 bg-gold/0 group-hover:bg-gold/15 rounded-lg transition-all duration-300">
                      <svg
                        className="w-5 h-5 text-gold transform group-hover:translate-x-1 transition-all duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
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
