import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../../components/Layout";
import ProductCard from "../../components/ProductCard";
import EmptyState from "../../components/EmptyState";
import { getStorage, STORAGE_KEYS } from "../../utils/storage";

/**
 * Product listing - Midnight Ivory theme
 * 5-6 cards per row desktop, search, filters, pagination
 */
const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

const ITEMS_PER_PAGE = 12;

export default function ProductList() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(categoryParam || "");
  const [sort, setSort] = useState("latest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setCategory(categoryParam || "");
  }, [categoryParam]);

  useEffect(() => {
    setLoading(true);
    let prods = getStorage(STORAGE_KEYS.PRODUCTS) || [];
    const cats = getStorage(STORAGE_KEYS.CATEGORIES) || [];
    setCategories(cats.filter((c) => c.isActive));

    prods = prods.filter((p) => p.isActive);
    if (search) {
      prods = prods.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category) {
      const cat = cats.find((c) => c.slug === category || c.name === category);
      if (cat) {
        prods = prods.filter(
          (p) => p.categoryId === cat.id || p.category === cat.name
        );
      }
    }
    // Min–Max filter: apply ONLY when BOTH values are entered
    if (minPrice && maxPrice) {
      const min = Number(minPrice);
      const max = Number(maxPrice);
      prods = prods.filter((p) => p.price >= min && p.price <= max);
    }

    if (sort === "price-low") prods = [...prods].sort((a, b) => a.price - b.price);
    else if (sort === "price-high")
      prods = [...prods].sort((a, b) => b.price - a.price);
    else
      prods = [...prods].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

    setProducts(prods);
    setPage(1);
    setLoading(false);
  }, [search, category, sort, minPrice, maxPrice]);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginatedProducts = products.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const inputClass =
    "px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-background";

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-serif text-2xl font-semibold text-textDark mb-2">
          Products
        </h1>
        <div className="h-px w-16 bg-gold mb-8" />

        {/* Search & Filters - Desktop */}
        <div className="hidden lg:block bg-gradient-card rounded-xl shadow-card p-4 mb-8 border border-border/50">
          <div className="flex flex-col lg:flex-row gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`flex-1 min-w-[200px] ${inputClass}`}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ""))}
                className={`w-24 ${inputClass}`}
              />
              <span className="text-muted">-</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ""))}
                className={`w-24 ${inputClass}`}
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className={inputClass}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile: Search + Filter toggle */}
        <div className="lg:hidden space-y-4 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full ${inputClass}`}
          />
          <button
            onClick={() => setFiltersOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3 border border-border rounded-xl text-muted hover:bg-background"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
        </div>

        {/* Mobile Filters Bottom Sheet */}
        {filtersOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-textDark/40"
              onClick={() => setFiltersOpen(false)}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif font-semibold text-lg">Filters</h3>
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="p-2 text-muted hover:text-textDark"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-textDark mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={inputClass + " w-full"}
                  >
                    <option value="">All</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-textDark mb-2">Price Range (both required)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ""))}
                      className={`flex-1 ${inputClass}`}
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ""))}
                      className={`flex-1 ${inputClass}`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-textDark mb-2">Sort</label>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className={inputClass + " w-full"}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="w-full py-3 bg-primary text-white rounded-xl font-medium"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 rounded-xl animate-skeleton" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Try adjusting your search or filters"
            actionLabel="Clear Filters"
            actionLink="/products"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-border rounded-xl disabled:opacity-50 hover:bg-background"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-muted">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-border rounded-xl disabled:opacity-50 hover:bg-background"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
