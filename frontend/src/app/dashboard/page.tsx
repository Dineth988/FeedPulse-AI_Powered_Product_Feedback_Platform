'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SentimentBadge from '../../../components/SentimentBadge';

interface Feedback {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: 'New' | 'In Review' | 'Resolved';
  submitterName?: string;
  submitterEmail?: string;
  ai_sentiment?: 'Positive' | 'Neutral' | 'Negative';
  ai_priority?: number;
  ai_summary?: string;
  ai_tags?: string[];
  ai_processed: boolean;
  createdAt: string;
}

const CATEGORIES = ['All', 'Bug', 'Feature Request', 'Improvement', 'Other'];
const STATUSES   = ['All', 'New', 'In Review', 'Resolved'];

const categoryColors: Record<string, string> = {
  Bug:              'bg-red-500/10 text-red-400 border-red-500/20',
  'Feature Request':'bg-violet-500/10 text-violet-400 border-violet-500/20',
  Improvement:      'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Other:            'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
};

const statusColors: Record<string, string> = {
  New:         'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'In Review': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Resolved:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

export default function DashboardPage() {
  const router = useRouter();

  const [items, setItems]             = useState<Feedback[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter]     = useState('All');
  const [updatingId, setUpdatingId]   = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('fp_admin')) {
      router.replace('/login');
    }
  }, [router]);

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (categoryFilter !== 'All') params.set('category', categoryFilter);
      if (statusFilter   !== 'All') params.set('status',   statusFilter);

      const res  = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback?${params}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to load feedback.');
      setItems(data.data.items);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load feedback.');
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, statusFilter]);

  useEffect(() => { fetchFeedback(); }, [fetchFeedback]);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems((prev) => prev.map((item) => item._id === id ? { ...item, status: status as Feedback['status'] } : item));
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fp_admin');
    router.push('/login');
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white leading-none">FeedPulse</h1>
              <p className="text-xs text-zinc-500 mt-0.5">Admin dashboard</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Sign out
          </button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total',     value: items.length },
            { label: 'New',       value: items.filter((i) => i.status === 'New').length },
            { label: 'In Review', value: items.filter((i) => i.status === 'In Review').length },
            { label: 'Resolved',  value: items.filter((i) => i.status === 'Resolved').length },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-zinc-900/80 border border-zinc-800/60 px-4 py-3">
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500">Category</label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs border transition-all
                    ${categoryFilter === cat
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/60 hover:border-zinc-600'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500">Status</label>
            <div className="flex flex-wrap gap-1.5">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs border transition-all
                    ${statusFilter === s
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/60 hover:border-zinc-600'
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <svg className="w-6 h-6 animate-spin text-amber-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/60 px-5 py-16 text-center">
            <p className="text-zinc-500 text-sm">No feedback found for the selected filters.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item._id}
                className="rounded-xl bg-zinc-900/80 border border-zinc-800/60 px-5 py-4 hover:border-zinc-700/60 transition-all"
              >
                <div className="flex items-start justify-between gap-4">

                  {/* Left */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h2 className="text-sm font-medium text-white truncate">{item.title}</h2>
                      {item.ai_priority && (
                        <span className="text-xs text-zinc-500 shrink-0">
                          Priority <span className="text-amber-400 font-medium">{item.ai_priority}/10</span>
                        </span>
                      )}
                    </div>

                    {/* AI summary if available, else description preview */}
                    <p className="text-xs text-zinc-400 line-clamp-2 mb-3">
                      {item.ai_summary || item.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Category */}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${categoryColors[item.category] ?? categoryColors.Other}`}>
                        {item.category}
                      </span>

                      {/* Sentiment badge */}
                      <SentimentBadge sentiment={item.ai_sentiment} />

                      {/* Tags */}
                      {item.ai_tags?.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs text-zinc-500 bg-zinc-800/60 border border-zinc-700/40 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}

                      {/* Date */}
                      <span className="text-xs text-zinc-600 ml-auto">{formatDate(item.createdAt)}</span>
                    </div>
                  </div>

                  {/* Right — status selector */}
                  <div className="shrink-0">
                    <select
                      value={item.status}
                      disabled={updatingId === item._id}
                      onChange={(e) => updateStatus(item._id, e.target.value)}
                      className={`text-xs rounded-lg px-2.5 py-1.5 border outline-none cursor-pointer transition-all
                        disabled:opacity-50 disabled:cursor-wait
                        bg-zinc-900 ${statusColors[item.status]}`}
                    >
                      <option value="New">New</option>
                      <option value="In Review">In Review</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>

                {/* Submitter */}
                {(item.submitterName || item.submitterEmail) && (
                  <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <span className="text-xs text-zinc-500">
                      {item.submitterName && <span>{item.submitterName}</span>}
                      {item.submitterName && item.submitterEmail && <span className="mx-1">·</span>}
                      {item.submitterEmail && <span>{item.submitterEmail}</span>}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}