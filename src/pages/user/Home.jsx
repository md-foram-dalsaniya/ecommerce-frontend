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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          {/* Premium Section Header */}
          <div className="mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-textDark mb-2">
              Shop by Category
            </h2>
            <p className="text-muted text-base md:text-lg mb-6 max-w-2xl">
              Explore our curated collection of premium products
            </p>
            {/* Thin gold underline accent */}
            <div className="h-1 w-16 bg-gold rounded-full" />
          </div>
          
          {/* Category Cards Grid - Smaller, Elegant Cards */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
            {categories.map((cat, index) => {
              // Elegant color palette for smaller cards
              const colors = [
                { bg: "bg-slate-900", accent: "border-gold", icon: "text-gold", hover: "hover:bg-slate-800" },
                { bg: "bg-indigo-600", accent: "border-indigo-400", icon: "text-indigo-300", hover: "hover:bg-indigo-700" },
                { bg: "bg-emerald-600", accent: "border-emerald-400", icon: "text-emerald-300", hover: "hover:bg-emerald-700" },
                { bg: "bg-orange-600", accent: "border-orange-400", icon: "text-orange-300", hover: "hover:bg-orange-700" },
                { bg: "bg-rose-600", accent: "border-rose-400", icon: "text-rose-300", hover: "hover:bg-rose-700" },
                { bg: "bg-teal-600", accent: "border-teal-400", icon: "text-teal-300", hover: "hover:bg-teal-700" },
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
                  <div className={`relative overflow-hidden rounded-xl h-32 md:h-40 ${color.bg} ${color.hover} transition-all duration-300 hover:shadow-lg hover:scale-[1.05] cursor-pointer flex flex-col items-center justify-center p-4 text-center border-2 border-transparent ${color.accent} hover:border-gold group`}>
                    
                    {/* Icon */}
                    <div className={`${color.icon} transition-all duration-300 group-hover:scale-110 mb-2`}>
                      <svg
                        className="w-6 h-6 md:w-8 md:h-8"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d={categoryIcons[cat.name] || "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"} />
                      </svg>
                    </div>
                    
                    {/* Category Name */}
                    <h3 className="font-serif text-sm md:text-base font-semibold text-white transition-all duration-300 line-clamp-2">
                      {cat.name}
                    </h3>
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
