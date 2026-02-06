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
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
            {categories.map((cat, index) => {
              // Category-specific colors for visual variety
              const colors = [
                { bg: "from-purple-50 to-pink-50", icon: "text-purple-600", hover: "from-purple-100 to-pink-100", iconBg: "bg-purple-100" },
                { bg: "from-blue-50 to-cyan-50", icon: "text-blue-600", hover: "from-blue-100 to-cyan-100", iconBg: "bg-blue-100" },
                { bg: "from-green-50 to-emerald-50", icon: "text-green-600", hover: "from-green-100 to-emerald-100", iconBg: "bg-green-100" },
                { bg: "from-orange-50 to-amber-50", icon: "text-orange-600", hover: "from-orange-100 to-amber-100", iconBg: "bg-orange-100" },
                { bg: "from-rose-50 to-red-50", icon: "text-rose-600", hover: "from-rose-100 to-red-100", iconBg: "bg-rose-100" },
                { bg: "from-indigo-50 to-purple-50", icon: "text-indigo-600", hover: "from-indigo-100 to-purple-100", iconBg: "bg-indigo-100" },
              ];
              const color = colors[index % colors.length];

              const categoryIcons = {
                "Electronics": "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z",
                "Fashion": "M16 2H8c-1.1 0-2 .9-2 2v11H2v2h2v3h2v-3h12v3h2v-3h2v-2h-4V4c0-1.1-.9-2-2-2zm-6 12H8V4h2v10zm6 0h-2V4h2v10z",
                "Home & Garden": "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
                "Sports": "M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2m0 18c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8m0-13c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5z",
                "Books": "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 9.5c0 .83-.67 1.5-1.5 1.5S11 13.33 11 12.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5z",
              };

              return (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.slug}`}
                  className="group"
                >
                  <div className={`bg-gradient-to-br ${color.bg} rounded-2xl p-4 h-full flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-lg hover:scale-105 border border-white/60 cursor-pointer overflow-hidden relative group-hover:${color.hover}`}>
                    
                    {/* Animated background accent */}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    
                    {/* Icon */}
                    <div className={`${color.iconBg} rounded-full p-3 mb-3 transition-transform duration-300 group-hover:scale-110 relative z-10`}>
                      <svg
                        className={`w-6 h-6 ${color.icon}`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d={categoryIcons[cat.name] || "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"} />
                      </svg>
                    </div>
                    
                    {/* Category Name */}
                    <h3 className="font-serif text-sm md:text-base font-semibold text-textDark transition-colors duration-300 group-hover:text-primary relative z-10">
                      {cat.name}
                    </h3>
                    
                    {/* Count or arrow indicator */}
                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative z-10">
                      <svg
                        className="w-4 h-4 text-primary animate-pulse"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
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
