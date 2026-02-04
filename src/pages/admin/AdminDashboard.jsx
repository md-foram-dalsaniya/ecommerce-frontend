import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getStorage, STORAGE_KEYS } from "../../utils/storage";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * Admin dashboard - Total Users, Products, Orders, Sales + Revenue chart
 */
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    sales: 0,
  });
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const users = getStorage(STORAGE_KEYS.USERS) || [];
    const products = getStorage(STORAGE_KEYS.PRODUCTS) || [];
    const orders = getStorage(STORAGE_KEYS.ORDERS) || [];

    const totalSales = orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((sum, o) => sum + o.total, 0);

    setStats({
      users: users.length,
      products: products.length,
      orders: orders.length,
      sales: totalSales,
    });

    // Revenue chart - last 6 months (mock by order date)
    const now = new Date();
    const months = [];
    const revenues = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d.toLocaleString("default", { month: "short" }) + " " + d.getFullYear());
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0).getTime();
      const monthRev = orders
        .filter((o) => {
          if (o.status === "Cancelled") return false;
          const t = new Date(o.createdAt).getTime();
          return t >= monthStart && t <= monthEnd;
        })
        .reduce((s, o) => s + o.total, 0);
      revenues.push(monthRev);
    }

    setChartData({
      labels: months,
      datasets: [
        {
          label: "Revenue (₹)",
          data: revenues,
          backgroundColor: "rgba(30, 41, 59, 0.8)",
          borderColor: "#1E293B",
          borderWidth: 1,
        },
      ],
    });
  }, []);

  const cards = [
    { label: "Total Users", value: stats.users, link: "/admin/users" },
    { label: "Total Products", value: stats.products, link: "/admin/products" },
    { label: "Total Orders", value: stats.orders, link: "/admin/orders" },
    {
      label: "Total Sales",
      value: `₹${stats.sales.toLocaleString("en-IN")}`,
      link: null,
    },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-textDark mb-8">
        Dashboard
      </h1>
      <div className="h-px w-16 bg-gold mb-8" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-gradient-card rounded-xl p-6 shadow-card border border-border/50 hover:shadow-cardHover transition-shadow"
          >
            <p className="text-muted text-sm font-medium">{card.label}</p>
            <p className="text-2xl font-bold text-textDark mt-1">{card.value}</p>
            {card.link && (
              <Link
                to={card.link}
                className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
              >
                View →
              </Link>
            )}
          </div>
        ))}
      </div>

      {chartData && (
        <div className="mt-8 bg-gradient-card rounded-xl p-6 shadow-card border border-border/50">
          <h2 className="font-serif text-lg font-semibold text-textDark mb-6">
            Revenue
          </h2>
          <div className="h-64">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (v) => "₹" + v,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
