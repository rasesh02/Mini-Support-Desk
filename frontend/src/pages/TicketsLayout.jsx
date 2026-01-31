import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const statusStyles = {
  OPEN: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:border-emerald-400/30',
  IN_PROGRESS: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-200 dark:border-amber-400/30',
  RESOLVED: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/15 dark:text-slate-200 dark:border-slate-400/30'
};

const priorityStyles = {
  LOW: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/15 dark:text-sky-200 dark:border-sky-400/30',
  MEDIUM: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-200 dark:border-indigo-400/30',
  HIGH: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-200 dark:border-rose-400/30'
};

const formatDate = (value) => {
  if (!value) return '';
  return new Date(value).toLocaleString();
};

function TicketsLayout() {
  const location = useLocation();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sort, setSort] = useState('createdAt:desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  const isDetailRoute = useMemo(() => location.pathname.includes('/tickets/'), [location.pathname]);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const sortParam = sort === 'createdAt:asc' ? 'createdAt' : '-createdAt';
      const queryParams = new URLSearchParams({
        ...(query ? { q: query } : {}),
        ...(status ? { status } : {}),
        ...(priority ? { priority } : {}),
        sort: sortParam,
        page: String(page),
        limit: String(limit)
      }).toString();

      const response = await fetch(`${API_BASE}/tickets${queryParams ? `?${queryParams}` : ''}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || 'Request failed');
      }

      setTickets(data.data || []);
      setPagination(data.pagination || { totalPages: 1, total: 0 });
    } catch (err) {
      setError(err.message || 'Unable to load tickets');
    } finally {
      setLoading(false);
    }
  }, [query, status, priority, sort, page, limit]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    const handleRefresh = () => fetchTickets();
    window.addEventListener('tickets:refresh', handleRefresh);
    return () => window.removeEventListener('tickets:refresh', handleRefresh);
  }, [fetchTickets]);

  const handleResetFilters = () => {
    setQuery('');
    setStatus('');
    setPriority('');
    setSort('createdAt:desc');
    setPage(1);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(320px,380px)_1fr]">
      <section className="order-1 space-y-4 lg:order-none">
        <div className="rounded-3xl border border-white/40 bg-violet-50/80 p-5 shadow-lg shadow-indigo-200/40 backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-indigo-900/20">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Tickets</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{pagination.total} results</p>
            </div>
            <Link
              to="/tickets/new"
              className="w-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:from-violet-400 hover:to-indigo-400 sm:w-auto"
            >
              Create Ticket
            </Link>
          </div>

          <div className="mt-4 grid gap-3">
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setPage(1);
                setQuery(event.target.value);
              }}
              placeholder="Search title or description"
              className="w-full rounded-2xl border border-slate-200 bg-violet-50/70 px-4 py-2 text-sm focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950/70"
            />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <select
                value={status}
                onChange={(event) => {
                  setPage(1);
                  setStatus(event.target.value);
                }}
                className="rounded-2xl border border-slate-200 bg-violet-50/80 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950/70"
              >
                <option value="">All status</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
              <select
                value={priority}
                onChange={(event) => {
                  setPage(1);
                  setPriority(event.target.value);
                }}
                className="rounded-2xl border border-slate-200 bg-violet-50/80 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950/70"
              >
                <option value="">All priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-violet-50/80 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950/70"
              >
                <option value="createdAt:desc">Newest first</option>
                <option value="createdAt:asc">Oldest first</option>
              </select>
              <button
                type="button"
                onClick={handleResetFilters}
                className="rounded-2xl border border-slate-200 bg-violet-50/80 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {loading && (
            <div className="rounded-3xl border border-white/40 bg-violet-50/70 p-6 text-center text-sm text-slate-500 shadow-lg shadow-indigo-200/30 backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/70 dark:text-slate-400">
              Loading tickets...
            </div>
          )}
          {error && (
            <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-700 shadow-lg shadow-rose-200/30 dark:border-rose-400/40 dark:bg-rose-950/40 dark:text-rose-200">
              {error}
            </div>
          )}
          {!loading && !error && tickets.length === 0 && (
            <div className="rounded-3xl border border-white/40 bg-violet-50/70 p-6 text-center text-sm text-slate-500 shadow-lg shadow-indigo-200/30 backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/70 dark:text-slate-400">
              No tickets found. Try adjusting filters.
            </div>
          )}
          {!loading &&
            tickets.map((ticket) => (
              <Link
                key={ticket._id}
                to={`/tickets/${ticket._id}`}
                className={`block rounded-3xl border bg-violet-50/70 p-4 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg backdrop-blur dark:bg-slate-900/70 ${
                  location.pathname.endsWith(ticket._id)
                    ? 'border-indigo-300 ring-1 ring-indigo-200 dark:border-indigo-500/60 dark:ring-indigo-500/30'
                    : 'border-white/40 dark:border-slate-800/60'
                }`}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{ticket.title}</h3>
                    <p className="mt-1 text-xs text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap">
                      {ticket.description}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 sm:text-right">{formatDate(ticket.createdAt)}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span
                    className={`rounded-full border px-2 py-1 font-medium ${statusStyles[ticket.status] || 'border-slate-200 text-slate-600'}`}
                  >
                    {ticket.status?.replace('_', ' ') || 'OPEN'}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-1 font-medium ${priorityStyles[ticket.priority] || 'border-slate-200 text-slate-600'}`}
                  >
                    {ticket.priority || 'MEDIUM'}
                  </span>
                </div>
              </Link>
            ))}

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between rounded-2xl border border-white/40 bg-violet-50/70 px-4 py-2 text-sm shadow-lg shadow-indigo-200/20 backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/70">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="rounded-full px-3 py-1 text-slate-600 disabled:text-slate-300"
              >
                Prev
              </button>
              <span className="text-slate-500">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                disabled={page >= pagination.totalPages}
                className="rounded-full px-3 py-1 text-slate-600 disabled:text-slate-300"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      <section className={`order-2 rounded-3xl border border-white/40 bg-violet-50/70 p-6 shadow-lg shadow-indigo-200/40 backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/70 lg:order-none ${isDetailRoute ? '' : ''}`}>
        <Outlet />
      </section>
    </div>
  );
}

export default TicketsLayout;
