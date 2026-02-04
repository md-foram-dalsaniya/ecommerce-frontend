import { useState, useEffect } from "react";
import { getStorage, setStorage, STORAGE_KEYS } from "../../utils/storage";
import { formatDate } from "../../utils/formatters";

const STATUS_OPTIONS = ["Placed", "Shipped", "Delivered", "Cancelled"];
const STATUS_COLORS = {
  Placed: "bg-amber-500/10 text-amber-700",
  Shipped: "bg-accentBlue/20 text-accentBlue",
  Delivered: "bg-success/10 text-success",
  Cancelled: "bg-danger/10 text-danger",
};

const inputClass =
  "px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 bg-background";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const ords = getStorage(STORAGE_KEYS.ORDERS) || [];
    const usrs = getStorage(STORAGE_KEYS.USERS) || [];
    setOrders(ords);
    setUsers(usrs);
    setLoading(false);
  };

  const getUserName = (userId) => {
    const u = users.find((user) => user.id === userId);
    return u?.name || u?.email || userId;
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      (getUserName(o.userId) || "").toLowerCase().includes(search.toLowerCase())
  );

  const updateOrderStatus = (orderId, status) => {
    const ords = getStorage(STORAGE_KEYS.ORDERS) || [];
    const updated = ords.map((o) => (o.id === orderId ? { ...o, status } : o));
    setStorage(STORAGE_KEYS.ORDERS, updated);
    loadData();
  };

  if (loading)
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 rounded animate-skeleton" />
        <div className="h-64 rounded-xl animate-skeleton" />
      </div>
    );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="font-serif text-2xl font-semibold text-textDark">
          Orders
        </h1>
        <input
          type="text"
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full sm:w-64 ${inputClass}`}
        />
      </div>

      <div className="bg-gradient-card rounded-xl shadow-card overflow-hidden border border-border/50">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-surface">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase">
                  Update
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-surface/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-textDark">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-muted">
                    {getUserName(order.userId)}
                  </td>
                  <td className="px-6 py-4 text-muted text-sm">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 font-medium text-textDark">
                    ₹{order.total?.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-xl text-xs font-medium ${STATUS_COLORS[order.status] || "bg-muted/20 text-muted"
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      className="px-3 py-1.5 border border-border rounded-xl text-sm bg-background"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <p className="text-center text-muted py-16">No orders yet.</p>
      )}
    </div>
  );
}
