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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="mb-12">
            <h2 className="font-serif text-4xl font-semibold text-textDark mb-3">
              Shop by Category
            </h2>
            <p className="text-muted text-lg mb-6">
              Explore our curated collection of premium products
            </p>
            <div className="h-1 w-24 bg-gradient-gold rounded-full" />
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {categories.map((cat, index) => {
              // Category-specific premium color palettes
              const colors = [
                { gradient: "from-slate-900 to-slate-800", accent: "from-gold to-amber-400", icon: "text-gold", light: "bg-gold/10" },
                { gradient: "from-indigo-600 to-indigo-700", accent: "from-indigo-400 to-cyan-300", icon: "text-indigo-300", light: "bg-indigo-500/10" },
                { gradient: "from-emerald-600 to-emerald-700", accent: "from-emerald-400 to-teal-300", icon: "text-emerald-300", light: "bg-emerald-500/10" },
                { gradient: "from-orange-600 to-orange-700", accent: "from-orange-400 to-amber-300", icon: "text-orange-300", light: "bg-orange-500/10" },
                { gradient: "from-rose-600 to-rose-700", accent: "from-rose-400 to-pink-300", icon: "text-rose-300", light: "bg-rose-500/10" },
                { gradient: "from-purple-600 to-purple-700", accent: "from-purple-400 to-pink-300", icon: "text-purple-300", light: "bg-purple-500/10" },
                { gradient: "from-cyan-600 to-cyan-700", accent: "from-cyan-400 to-blue-300", icon: "text-cyan-300", light: "bg-cyan-500/10" },
                { gradient: "from-amber-600 to-amber-700", accent: "from-amber-400 to-yellow-300", icon: "text-amber-300", light: "bg-amber-500/10" },
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
                  <div className={`relative overflow-hidden rounded-2xl h-48 md:h-56 bg-gradient-to-br ${color.gradient} transition-all duration-500 hover:shadow-2xl hover:scale-[1.08] cursor-pointer flex flex-col items-center justify-center p-6 text-center`}>
                    
                    {/* Animated background gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${color.accent} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                    
                    {/* Decorative shape - top right */}
                    <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white opacity-5 group-hover:opacity-10 transition-opacity duration-500" />
                    
                    {/* Icon container */}
                    <div className={`relative z-10 ${color.light} backdrop-blur-sm rounded-full p-4 mb-4 transition-all duration-500 group-hover:scale-125 group-hover:shadow-lg`}>
                      <svg
                        className={`w-8 h-8 md:w-10 md:h-10 ${color.icon} transition-transform duration-500 group-hover:rotate-6`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d={categoryIcons[cat.name] || "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"} />
                      </svg>
                    </div>
                    
                    {/* Category Name */}
                    <h3 className="font-serif text-lg md:text-xl font-semibold text-white relative z-10 transition-all duration-500 group-hover:scale-110">
                      {cat.name}
                    </h3>
                    
                    {/* Arrow indicator - appears on hover */}
                    <div className="mt-3 opacity-0 group-hover:opacity-100 transition-all duration-500 relative z-10 transform translate-y-2 group-hover:translate-y-0">
                      <svg
                        className="w-5 h-5 text-white"
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
                    
                    {/* Decorative shape - bottom left */}
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white opacity-5 group-hover:opacity-10 transition-opacity duration-500" />
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
