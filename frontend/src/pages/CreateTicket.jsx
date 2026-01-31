import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function CreateTicket() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', priority: 'MEDIUM', status: 'OPEN' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.title.trim().length < 5) {
      setError('Title must be at least 5 characters.');
      return;
    }
    if (form.description.trim().length < 20) {
      setError('Description must be at least 20 characters.');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`${API_BASE}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          priority: form.priority,
          status: form.status
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || 'Request failed');
      }
      navigate(`/tickets/${data.data._id}`);
    } catch (err) {
      setError(err.message || 'Unable to create ticket');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl border border-white/40 bg-violet-50/70 p-5 shadow-lg shadow-indigo-200/30 backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/70 sm:p-6">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Create Ticket</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Provide a clear title and helpful description.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="text-xs font-semibold uppercase text-slate-400">Title</span>
            <input
              type="text"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Short summary of the issue"
              className="mt-2 w-full rounded-xl border border-white/40 bg-violet-50/70 px-3 py-2 text-sm dark:border-slate-700/60 dark:bg-slate-950/70"
            />
          </label>

          <label className="block text-sm">
            <span className="text-xs font-semibold uppercase text-slate-400">Description</span>
            <textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              rows={5}
              placeholder="Describe the problem with context and steps to reproduce"
              className="mt-2 w-full rounded-xl border border-white/40 bg-violet-50/70 px-3 py-2 text-sm dark:border-slate-700/60 dark:bg-slate-950/70"
            />
          </label>

          <label className="block text-sm">
            <span className="text-xs font-semibold uppercase text-slate-400">Priority</span>
            <select
              value={form.priority}
              onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}
              className="mt-2 w-full rounded-xl border border-white/40 bg-violet-50/70 px-3 py-2 text-sm dark:border-slate-700/60 dark:bg-slate-950/70"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-xs font-semibold uppercase text-slate-400">Status</span>
            <select
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
              className="mt-2 w-full rounded-xl border border-white/40 bg-violet-50/70 px-3 py-2 text-sm dark:border-slate-700/60 dark:bg-slate-950/70"
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </label>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:from-violet-400 hover:to-indigo-400 disabled:opacity-60"
            >
              {saving ? 'Creating...' : 'Create Ticket'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-xl border border-white/40 bg-violet-50/70 px-4 py-2 text-sm text-slate-600 shadow-sm dark:border-slate-700/60 dark:bg-slate-950/70 dark:text-slate-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTicket;
