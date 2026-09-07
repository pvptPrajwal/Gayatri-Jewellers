import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchUsers, updateUserStatus } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';

const AdminCustomers = () => {
  const [result, setResult] = useState({ users: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const load = () => {
    setLoading(true);
    fetchUsers({ role: 'CUSTOMER', search, page, limit: 15 })
      .then(setResult)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const toggleStatus = async (user) => {
    try {
      await updateUserStatus(user._id, !user.isActive);
      toast.success(user.isActive ? 'Customer deactivated' : 'Customer activated');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl">Customers</h1>

      <form onSubmit={handleSearchSubmit} className="mt-6 flex max-w-sm items-center gap-2 border border-sand-dark bg-ivory px-3 py-2">
        <Search size={16} className="text-charcoal-soft" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, phone…"
          className="w-full bg-transparent text-sm focus:outline-none"
        />
      </form>

      <div className="mt-6 overflow-x-auto border border-sand-dark bg-ivory">
        {loading ? (
          <LoadingSpinner />
        ) : result.users.length === 0 ? (
          <EmptyState title="No customers found" />
        ) : (
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-sand-dark text-xs text-charcoal-soft">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-dark/60">
              {result.users.map((u) => (
                <tr key={u._id}>
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3 text-charcoal-soft">{u.email}</td>
                  <td className="px-4 py-3 text-charcoal-soft">{u.phone}</td>
                  <td className="px-4 py-3 text-charcoal-soft">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-[10px] ${u.isActive ? 'bg-pine/10 text-pine' : 'bg-maroon/10 text-maroon'}`}>
                      {u.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => toggleStatus(u)} className="text-xs text-gold-deep hover:underline">
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={result.page} pages={result.pages} onPageChange={setPage} />
    </div>
  );
};

export default AdminCustomers;
