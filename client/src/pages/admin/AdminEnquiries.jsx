import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchEnquiries, updateEnquiry } from '../../services/miscService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';

const STATUSES = ['NEW', 'IN_PROGRESS', 'RESOLVED'];
const STATUS_STYLE = {
  NEW: 'bg-maroon/10 text-maroon',
  IN_PROGRESS: 'bg-gold/10 text-gold-deep',
  RESOLVED: 'bg-pine/10 text-pine',
};

const AdminEnquiries = () => {
  const [result, setResult] = useState({ enquiries: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(null);

  const load = () => {
    setLoading(true);
    fetchEnquiries({ page, limit: 15 })
      .then(setResult)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusChange = async (enquiry, status) => {
    try {
      await updateEnquiry(enquiry._id, { status });
      toast.success('Status updated');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl">Enquiries</h1>

      <div className="mt-6 border border-sand-dark bg-ivory">
        {loading ? (
          <LoadingSpinner />
        ) : result.enquiries.length === 0 ? (
          <EmptyState title="No enquiries yet" />
        ) : (
          <div className="divide-y divide-sand-dark/60">
            {result.enquiries.map((enq) => (
              <div key={enq._id} className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setExpanded(expanded === enq._id ? null : enq._id)}
                    className="text-left"
                  >
                    <p className="font-medium">{enq.subject}</p>
                    <p className="text-xs text-charcoal-soft">
                      {enq.name} · {enq.phone} · {new Date(enq.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </button>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-[10px] ${STATUS_STYLE[enq.status]}`}>{enq.status.replace('_', ' ')}</span>
                    <select
                      value={enq.status}
                      onChange={(e) => handleStatusChange(enq, e.target.value)}
                      className="border border-sand-dark bg-ivory px-2 py-1 text-xs"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {expanded === enq._id && (
                  <p className="mt-3 max-w-2xl text-sm text-charcoal-soft">{enq.message}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Pagination page={result.page} pages={result.pages} onPageChange={setPage} />
    </div>
  );
};

export default AdminEnquiries;
