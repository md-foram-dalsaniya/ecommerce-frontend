import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useCurrency } from "../context/CurrencyContext";

/**
 * Main layout - Midnight Ivory theme
 * Sticky header, transparent on scroll, Wishlist/Cart icons on right
 * User name only inside profile dropdown
 */
export default function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { currency, toggleCurrency } = useCurrency();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header - sticky, slightly transparent on scroll */}
      <header
        className={`sticky top-0 z-40 border-b transition-all duration-300 relative ${headerScrolled ? "bg-primary/95 backdrop-blur-sm border-white/10" : "bg-gradient-primary border-white/10"
          } shadow-soft`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-[72px]">
            <div className="flex items-center gap-3">
              {/* Hamburger - tablet & mobile */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              <Link
                to="/"
                className="font-serif text-xl font-semibold text-white hover:opacity-90 transition-opacity duration-300"
              >
                ShopEase
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${location.pathname === "/" ? "text-gold" : "text-white/90 hover:text-white"
                  }`}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`text-sm font-medium transition-colors ${isActive("/products") && !isActive("/products/") ? "text-gold" : "text-white/90 hover:text-white"
                  }`}
              >
                Products
              </Link>
              {user && !isAdmin && (
                <Link
                  to="/orders"
                  className={`text-sm font-medium transition-colors ${isActive("/orders") ? "text-gold" : "text-white/90 hover:text-white"
                    }`}
                >
                  Orders
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-sm font-medium text-gold/90 hover:text-gold transition-colors"
                >
                  Admin
                </Link>
              )}
            </nav>

            {/* Right side: Currency toggle, Wishlist, Cart, Profile */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Currency Toggle */}
              <button
                onClick={toggleCurrency}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
                title="Toggle currency"
              >
                {currency === "INR" ? "₹" : "$"}
              </button>

              {/* Wishlist and Cart - always visible for non-admin */}
              {!isAdmin && (
                <>
                  <Link
                    to="/wishlist"
                    className="relative p-2 text-white/90 hover:text-gold transition-colors rounded-lg hover:bg-white/5"
                    title="Wishlist"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    {wishlistItems.length > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-gold text-primary text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                        {wishlistItems.length}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/cart"
                    className="relative p-2 text-white/90 hover:text-gold transition-colors rounded-lg hover:bg-white/5"
                    title="Cart"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {getCartCount() > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-gold text-primary text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                        {getCartCount()}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <svg
                      className={`w-4 h-4 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {profileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setProfileOpen(false)}
                        aria-hidden="true"
                      />
                      <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-softHover border border-border py-2 z-50">
                        <p className="px-4 py-2 text-sm font-medium text-textDark border-b border-border">
                          {user.name}
                        </p>
                        {!isAdmin && (
                          <>
                            <Link
                              to="/profile"
                              onClick={() => setProfileOpen(false)}
                              className="block px-4 py-2 text-sm text-muted hover:bg-background hover:text-primary"
                            >
                              Profile & Addresses
                            </Link>
                            <Link
                              to="/orders"
                              onClick={() => setProfileOpen(false)}
                              className="block px-4 py-2 text-sm text-muted hover:bg-background hover:text-primary"
                            >
                              My Orders
                            </Link>
                          </>
                        )}
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setProfileOpen(false)}
                            className="block px-4 py-2 text-sm text-muted hover:bg-background hover:text-primary"
                          >
                            Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger/5"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-medium bg-white text-primary rounded-xl hover:bg-white/90 shadow-soft transition-all duration-300 active:scale-[0.98]"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet toggle menu - bg #1E293B */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <nav
            className="bg-[#1E293B] border-b border-white/10 py-4 px-4"
            style={{ backgroundColor: "#1E293B" }}
          >
            <div className="flex flex-col gap-1">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${location.pathname === "/" ? "text-gold bg-white/10" : "text-white/90 hover:text-white hover:bg-white/5"
                  }`}
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${location.pathname.startsWith("/products") ? "text-gold bg-white/10" : "text-white/90 hover:text-white hover:bg-white/5"
                  }`}
              >
                Products
              </Link>
              <Link
                to="/orders"
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${location.pathname.startsWith("/orders") ? "text-gold bg-white/10" : "text-white/90 hover:text-white hover:bg-white/5"
                  }`}
              >
                Orders
              </Link>
              <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${location.pathname === "/cart" ? "text-gold bg-white/10" : "text-white/90 hover:text-white hover:bg-white/5"
                  }`}
              >
                Cart {getCartCount() > 0 && `(${getCartCount()})`}
              </Link>
              {user && !isAdmin && (
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${location.pathname === "/profile" ? "text-gold bg-white/10" : "text-white/90 hover:text-white hover:bg-white/5"
                    }`}
                >
                  Profile
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-gold/90 hover:text-gold hover:bg-white/5 transition-colors"
                >
                  Admin
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gradient-primary text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="font-serif font-semibold text-lg mb-3">ShopEase</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Premium e-commerce. Quality products, elegant experience.
              </p>
            </div>
            <div>
              <h3 className="font-serif font-semibold text-lg mb-3">Quick Links</h3>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>
                  <Link to="/products" className="hover:text-gold transition-colors">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-gold transition-colors">
                    Home
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-serif font-semibold text-lg mb-3">Payment</h3>
              <p className="text-white/70 text-sm">Cash on Delivery (COD) available</p>
            </div>
          </div>
          <div className="border-t border-white/20 mt-10 pt-8 text-center text-white/60 text-sm">
            © {new Date().getFullYear()} ShopEase. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
