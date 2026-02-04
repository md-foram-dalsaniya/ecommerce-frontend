import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Admin layout - sidebar #0F172A, gold accent on active
 */
export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/admin", label: "Dashboard", end: true },
    { to: "/admin/products", label: "Products", end: false },
    { to: "/admin/categories", label: "Categories", end: false },
    { to: "/admin/users", label: "Users", end: false },
    { to: "/admin/orders", label: "Orders", end: false },
  ];

  const navLinkClass = ({ isActive }) =>
    `block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${isActive ? "bg-gold/20 text-gold" : "text-white/70 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-adminSidebar text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <h1 className="font-serif text-xl font-semibold">ShopEase Admin</h1>
          <p className="text-sm text-white/60 mt-1 truncate">{user?.email}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={navLinkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-1">
          <NavLink
            to="/"
            className="block px-4 py-2.5 text-white/70 hover:bg-white/5 rounded-xl text-sm font-medium transition-colors"
          >
            ← View Store
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 text-danger/90 hover:bg-danger/10 rounded-xl text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-background">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
