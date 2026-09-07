import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import { Gem, Users, FolderTree, Layers, AlertTriangle, PackageX } from 'lucide-react';
import { fetchDashboardStats } from '../../services/adminService';
import { formatINR } from '../../utils/formatCurrency';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const STATUS_COLORS = { IN_STOCK: '#33473B', LOW_STOCK: '#A8792E', OUT_OF_STOCK: '#7A2331' };
const STATUS_LABELS = { IN_STOCK: 'In Stock', LOW_STOCK: 'Low Stock', OUT_OF_STOCK: 'Out of Stock' };

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading dashboard…" />;
  if (!data) return <p className="text-sm text-maroon">Could not load dashboard stats.</p>;

  const { stats, lowStockProducts, recentProducts, stockByStatus, productsByCategory } = data;

  const pieData = stockByStatus.map((s) => ({
    name: STATUS_LABELS[s._id] || s._id,
    value: s.count,
    key: s._id,
  }));

  return (
    <div>
      <h1 className="font-display text-3xl">Dashboard</h1>
      <p className="mt-1 text-sm text-charcoal-soft">Overview of your store's catalog and customers.</p>

      {/* Stat cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Gem} label="Total Products" value={stats.totalProducts} to="/admin/products" />
        <StatCard icon={Users} label="Total Customers" value={stats.totalCustomers} to="/admin/customers" />
        <StatCard icon={FolderTree} label="Categories" value={stats.totalCategories} to="/admin/categories" />
        <StatCard icon={Layers} label="Collections" value={stats.totalCollections} to="/admin/collections" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3 border border-sand-dark bg-ivory p-4">
          <AlertTriangle size={18} className="text-gold-deep" />
          <div>
            <p className="text-xs text-charcoal-soft">Orders / Enquiries</p>
            <p className="text-sm text-charcoal">Available once Phase 3 backend is added</p>
          </div>
        </div>
        <div className="flex items-center gap-3 border border-sand-dark bg-ivory p-4">
          <PackageX size={18} className="text-maroon" />
          <div>
            <p className="text-xs text-charcoal-soft">Out of Stock</p>
            <p className="text-lg font-medium text-charcoal">{stats.outOfStockCount} products</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border border-sand-dark bg-ivory p-5">
          <h3 className="font-display text-lg">Products by Category</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productsByCategory} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E1D3B4" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#A8792E" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border border-sand-dark bg-ivory p-5">
          <h3 className="font-display text-lg">Stock Health</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {pieData.map((entry) => (
                    <Cell key={entry.key} fill={STATUS_COLORS[entry.key] || '#999'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Low stock + recent */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border border-sand-dark bg-ivory p-5">
          <h3 className="font-display text-lg">Low Stock Products</h3>
          {lowStockProducts.length === 0 ? (
            <p className="mt-3 text-sm text-charcoal-soft">Nothing running low right now.</p>
          ) : (
            <ul className="mt-3 divide-y divide-sand-dark/60">
              {lowStockProducts.map((p) => (
                <li key={p._id} className="flex items-center justify-between py-2 text-sm">
                  <span>{p.name}</span>
                  <span className="text-gold-deep">{p.stockQuantity} left</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border border-sand-dark bg-ivory p-5">
          <h3 className="font-display text-lg">Recently Added</h3>
          <ul className="mt-3 divide-y divide-sand-dark/60">
            {recentProducts.map((p) => (
              <li key={p._id} className="flex items-center justify-between py-2 text-sm">
                <span>{p.name}</span>
                <span className="text-charcoal-soft">{formatINR(p.finalPrice)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, to }) => (
  <Link to={to} className="border border-sand-dark bg-ivory p-5 transition-colors hover:border-gold">
    <Icon size={20} className="text-gold" />
    <p className="mt-3 text-2xl font-medium text-charcoal">{value}</p>
    <p className="text-xs text-charcoal-soft">{label}</p>
  </Link>
);

export default Dashboard;
