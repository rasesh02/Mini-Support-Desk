import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const statusOptions = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];
const priorityOptions = ['LOW', 'MEDIUM', 'HIGH'];

const formatDate = (value) => (value ? new Date(value).toLocaleString() : '');

function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [comments, setComments] = useState([]);
  const [commentPage, setCommentPage] = useState(1);
  const [commentPagination, setCommentPagination] = useState({ totalPages: 1 });
  const [commentForm, setCommentForm] = useState({ authorName: '', message: '' });

  const canLoadMore = useMemo(
    () => commentPage < (commentPagination?.totalPages || 1),
    [commentPage, commentPagination]
  );

  useEffect(() => {
    const fetchTicket = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE}/tickets/${id}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data?.message || 'Request failed');
        }
        setTicket(data.data);
      } catch (err) {
        setError(err.message || 'Unable to load ticket');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTicket();
    }
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const queryParams = new URLSearchParams({
          page: String(commentPage),
          limit: '5'
        }).toString();
        const response = await fetch(`${API_BASE}/tickets/${id}/comments?${queryParams}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data?.message || 'Request failed');
        }
        setComments((prev) => (commentPage === 1 ? data.data : [...prev, ...data.data]));
        setCommentPagination(data.pagination);
      } catch (err) {
        setCommentError(err.message || 'Unable to load comments');
      }
    };

    if (id) {
      fetchComments();
    }
  }, [id, commentPage]);

  const handleUpdateTicket = async () => {
    if (!ticket) return;
    setSaving(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/tickets/${ticket._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: ticket.status,
          priority: ticket.priority,
          title: ticket.title,
          description: ticket.description
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || 'Request failed');
      }
      setTicket(data.data);
      window.dispatchEvent(new Event('tickets:refresh'));
    } catch (err) {
      setError(err.message || 'Unable to update ticket');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (!ticket) return;
    const confirmed = window.confirm('Are you sure you want to delete this ticket?');
    if (!confirmed) return;

    setSaving(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/tickets/${ticket._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || 'Request failed');
      }
      window.dispatchEvent(new Event('tickets:refresh'));
      navigate('/');
    } catch (err) {
      setError(err.message || 'Unable to delete ticket');
    } finally {
      setSaving(false);
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    setCommentError('');

    if (!commentForm.authorName.trim() || !commentForm.message.trim()) {
      setCommentError('Please provide your name and a comment.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/tickets/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          authorName: commentForm.authorName.trim(),
          message: commentForm.message.trim()
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || 'Request failed');
      }
      setComments((prev) => [data.data, ...prev]);
      setCommentForm({ authorName: '', message: '' });
    } catch (err) {
      setCommentError(err.message || 'Unable to create comment');
    }
  };

  if (loading) {
    return <div className="text-sm text-slate-500">Loading ticket...</div>;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-700 dark:border-rose-400/40 dark:bg-rose-950/40 dark:text-rose-200">
        {error}
      </div>
    );
  }

  if (!ticket) {
    return <div className="text-sm text-slate-500">Ticket not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wide text-slate-400">Ticket detail</p>
              <input
                type="text"
                value={ticket.title}
                onChange={(event) => setTicket({ ...ticket, title: event.target.value })}
                className="mt-2 w-full rounded-xl border border-white/40 bg-violet-50/70 px-3 py-2 text-2xl font-semibold text-slate-900 shadow-sm backdrop-blur dark:border-slate-700/60 dark:bg-slate-950/70 dark:text-slate-100"
              />
          </div>
          <div className="rounded-2xl border border-white/40 bg-violet-50/70 px-4 py-2 text-xs text-slate-500 shadow-sm backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/70 dark:text-slate-300">
            Created {formatDate(ticket.createdAt)}
          </div>
        </div>
        <textarea
          value={ticket.description}
          onChange={(event) => setTicket({ ...ticket, description: event.target.value })}
          rows={4}
          className="mt-4 w-full rounded-xl border border-white/40 bg-violet-50/70 px-3 py-2 text-sm text-slate-600 shadow-sm backdrop-blur dark:border-slate-700/60 dark:bg-slate-950/70 dark:text-slate-200"
        />
      </div>

      <div className="grid gap-4 rounded-3xl border border-white/40 bg-violet-50/70 p-4 shadow-lg shadow-indigo-200/30 backdrop-blur dark:border-slate-800/60 dark:bg-slate-950/60 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-sm">
          <span className="text-xs font-medium uppercase text-slate-400">Status</span>
          <select
            value={ticket.status}
            onChange={(event) => setTicket({ ...ticket, status: event.target.value })}
            className="mt-2 w-full rounded-xl border border-white/40 bg-violet-50/70 px-3 py-2 text-sm dark:border-slate-700/60 dark:bg-slate-950/70"
          >
            {statusOptions.map((value) => (
              <option key={value} value={value}>
                {value.replace('_', ' ')}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="text-xs font-medium uppercase text-slate-400">Priority</span>
          <select
            value={ticket.priority}
            onChange={(event) => setTicket({ ...ticket, priority: event.target.value })}
            className="mt-2 w-full rounded-xl border border-white/40 bg-violet-50/70 px-3 py-2 text-sm dark:border-slate-700/60 dark:bg-slate-950/70"
          >
            {priorityOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <button
            type="button"
            onClick={handleUpdateTicket}
            disabled={saving}
            className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:from-violet-400 hover:to-indigo-400 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
          <button
            type="button"
            onClick={handleDeleteTicket}
            disabled={saving}
            className="w-full rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 shadow-sm hover:bg-rose-100 disabled:opacity-60 dark:border-rose-400/40 dark:bg-rose-950/40 dark:text-rose-200"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-white/40 bg-violet-50/70 p-5 shadow-lg shadow-indigo-200/30 backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/70">
        <h3 className="text-lg font-semibold">Comments</h3>
        <form onSubmit={handleCommentSubmit} className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Your name"
              value={commentForm.authorName}
              onChange={(event) => setCommentForm((prev) => ({ ...prev, authorName: event.target.value }))}
              className="rounded-xl border border-white/40 bg-violet-50/70 px-3 py-2 text-sm dark:border-slate-700/60 dark:bg-slate-950/70"
            />
            <input
              type="text"
              placeholder="Write a comment"
              value={commentForm.message}
              onChange={(event) => setCommentForm((prev) => ({ ...prev, message: event.target.value }))}
              className="rounded-xl border border-white/40 bg-violet-50/70 px-3 py-2 text-sm dark:border-slate-700/60 dark:bg-slate-950/70"
            />
          </div>
          {commentError && <p className="text-sm text-rose-600">{commentError}</p>}
          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-300/20 hover:bg-slate-800 dark:bg-white/10 dark:text-white"
          >
            Add comment
          </button>
        </form>

        <div className="mt-4 space-y-3">
          {comments.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No comments yet.</p>}
          {comments.map((comment) => (
            <div key={comment._id} className="rounded-2xl border border-white/40 bg-violet-50/70 p-4 shadow-sm backdrop-blur dark:border-slate-800/60 dark:bg-slate-950/60">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium text-slate-600 dark:text-slate-200">{comment.authorName}</span>
                <span>{formatDate(comment.createdAt)}</span>
              </div>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{comment.message}</p>
            </div>
          ))}
        </div>

        {canLoadMore && (
          <button
            type="button"
            onClick={() => setCommentPage((prev) => prev + 1)}
            className="mt-4 rounded-xl border border-white/40 bg-violet-50/70 px-4 py-2 text-sm text-slate-600 shadow-sm hover:text-slate-800 dark:border-slate-700/60 dark:bg-slate-950/70 dark:text-slate-200"
          >
            Load more comments
          </button>
        )}
      </div>
    </div>
  );
}

export default TicketDetail;
