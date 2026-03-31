'use client';

import { useState } from 'react';

type Category = 'Bug' | 'Feature Request' | 'Improvement' | 'Other';

interface FormData {
  title: string;
  description: string;
  category: Category | '';
  submitterName: string;
  submitterEmail: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  submitterEmail?: string;
}

const CATEGORIES: Category[] = ['Bug', 'Feature Request', 'Improvement', 'Other'];
const DESC_MIN = 20;
const DESC_MAX = 1000;

const categoryStyles: Record<Category, string> = {
  Bug: 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20',
  'Feature Request': 'bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20',
  Improvement: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20',
  Other: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20 hover:bg-zinc-500/20',
};

export default function FeedbackForm() {
  const [form, setForm] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    submitterName: '',
    submitterEmail: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});

  const validate = (data: FormData): FormErrors => {
    const errs: FormErrors = {};

    if (!data.title.trim()) {
      errs.title = 'Title is required.';
    } else if (data.title.trim().length < 5) {
      errs.title = 'Title must be at least 5 characters.';
    } else if (data.title.trim().length > 120) {
      errs.title = 'Title must be under 120 characters.';
    }

    if (!data.description.trim()) {
      errs.description = 'Description is required.';
    } else if (data.description.trim().length < DESC_MIN) {
      errs.description = `Description must be at least ${DESC_MIN} characters.`;
    }

    if (!data.category) {
      errs.category = 'Please select a category.';
    }

    if (data.submitterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.submitterEmail)) {
      errs.submitterEmail = 'Please enter a valid email address.';
    }

    return errs;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    if (touched[name as keyof FormData]) {
      setErrors(validate(updated));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(form));
  };

  const handleCategorySelect = (cat: Category) => {
    const updated = { ...form, category: cat };
    setForm(updated);
    if (touched.category) setErrors(validate(updated));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, description: true, category: true, submitterEmail: true });

    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('loading');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category,
          submitterName: form.submitterName.trim() || undefined,
          submitterEmail: form.submitterEmail.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong. Please try again.');
      }

      setStatus('success');
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Unexpected error. Please try again.');
    }
  };

  const handleReset = () => {
    setForm({ title: '', description: '', category: '', submitterName: '', submitterEmail: '' });
    setErrors({});
    setTouched({});
    setStatus('idle');
    setErrorMessage('');
  };

  const descLen = form.description.length;
  const descRemaining = DESC_MAX - descLen;
  const descProgress = Math.min((descLen / DESC_MIN) * 100, 100);

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2">Feedback received</h2>
        <p className="text-zinc-400 text-sm max-w-sm mb-8">
          Thanks for taking the time. Our AI is analysing your submission and the team will review it shortly.
        </p>
        <button
          onClick={handleReset}
          className="text-sm text-amber-400 hover:text-amber-300 underline underline-offset-4 transition-colors"
        >
          Submit another piece of feedback
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">

      {/* Error banner */}
      {status === 'error' && (
        <div className="flex items-start gap-3 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
          <svg className="w-5 h-5 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-sm text-red-400">{errorMessage}</p>
        </div>
      )}

      {/* Title */}
      <div className="space-y-1.5">
        <label htmlFor="title" className="block text-sm font-medium text-zinc-300">
          Title <span className="text-amber-400">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={120}
          placeholder="What's the issue or idea in one line?"
          className={`w-full rounded-lg bg-zinc-800/60 border px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all
            focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50
            ${errors.title && touched.title
              ? 'border-red-500/50 bg-red-500/5'
              : 'border-zinc-700/60 hover:border-zinc-600'
            }`}
        />
        <div className="flex items-center justify-between">
          {errors.title && touched.title ? (
            <p className="text-xs text-red-400">{errors.title}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-zinc-600 ml-auto">{form.title.length}/120</span>
        </div>
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-zinc-300">
          Category <span className="text-amber-400">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-2 rounded-lg border text-xs font-medium transition-all
                ${form.category === cat
                  ? `${categoryStyles[cat]} ring-1 ring-offset-0`
                  : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {errors.category && touched.category && (
          <p className="text-xs text-red-400">{errors.category}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label htmlFor="description" className="block text-sm font-medium text-zinc-300">
          Description <span className="text-amber-400">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={DESC_MAX}
          rows={5}
          placeholder="Describe your feedback in detail. The more context you give, the better we can help."
          className={`w-full rounded-lg bg-zinc-800/60 border px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all resize-none
            focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50
            ${errors.description && touched.description
              ? 'border-red-500/50 bg-red-500/5'
              : 'border-zinc-700/60 hover:border-zinc-600'
            }`}
        />

        {/* Character counter + progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            {errors.description && touched.description ? (
              <p className="text-xs text-red-400">{errors.description}</p>
            ) : descLen < DESC_MIN ? (
              <p className="text-xs text-zinc-500">{DESC_MIN - descLen} more characters needed</p>
            ) : (
              <p className="text-xs text-emerald-500">Minimum reached ✓</p>
            )}
            <span className={`text-xs ml-auto ${descRemaining < 50 ? 'text-amber-400' : 'text-zinc-600'}`}>
              {descRemaining} remaining
            </span>
          </div>

          {/* Progress bar toward minimum */}
          {descLen < DESC_MIN && (
            <div className="h-0.5 w-full rounded-full bg-zinc-700/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-300"
                style={{ width: `${descProgress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Optional fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="submitterName" className="block text-sm font-medium text-zinc-300">
            Name <span className="text-zinc-600 font-normal text-xs">(optional)</span>
          </label>
          <input
            id="submitterName"
            name="submitterName"
            type="text"
            value={form.submitterName}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full rounded-lg bg-zinc-800/60 border border-zinc-700/60 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all hover:border-zinc-600 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="submitterEmail" className="block text-sm font-medium text-zinc-300">
            Email <span className="text-zinc-600 font-normal text-xs">(optional)</span>
          </label>
          <input
            id="submitterEmail"
            name="submitterEmail"
            type="email"
            value={form.submitterEmail}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="you@example.com"
            className={`w-full rounded-lg bg-zinc-800/60 border px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all
              hover:border-zinc-600 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50
              ${errors.submitterEmail && touched.submitterEmail
                ? 'border-red-500/50 bg-red-500/5'
                : 'border-zinc-700/60'
              }`}
          />
          {errors.submitterEmail && touched.submitterEmail && (
            <p className="text-xs text-red-400">{errors.submitterEmail}</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/40 disabled:cursor-not-allowed
          text-zinc-900 font-semibold text-sm px-6 py-3.5 transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-amber-500/60 focus:ring-offset-2 focus:ring-offset-zinc-900"
      >
        {status === 'loading' ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Submitting…
          </span>
        ) : (
          'Submit Feedback'
        )}
      </button>

      <p className="text-center text-xs text-zinc-600">
        No account needed. Feedback is reviewed by our product team.
      </p>
    </form>
  );
}