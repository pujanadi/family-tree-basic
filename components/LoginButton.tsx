import { FormEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";

interface FormState {
  name: string;
  email: string;
  error?: string | null;
}

const initialForm: FormState = {
  name: "",
  email: "",
  error: null
};

export default function LoginButton() {
  const { user, login, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current) {
        return;
      }
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = form.name.trim();
    if (!trimmedName) {
      setForm((prev) => ({ ...prev, error: "Please enter your name" }));
      return;
    }
    try {
      login({ name: trimmedName, email: form.email.trim() || undefined });
      setForm(initialForm);
      setIsOpen(false);
    } catch (error) {
      setForm((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Unable to sign in"
      }));
    }
  };

  const handleSignOut = () => {
    logout();
    setIsOpen(false);
  };

  if (user) {
    return (
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-full border border-transparent bg-misty-teal-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-misty-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-misty-teal-200"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-sm font-semibold uppercase">
            {user.initials}
          </span>
          <span>{user.name}</span>
        </button>
        {isOpen && (
          <div className="absolute right-0 z-30 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-ambient dark:border-slate-700 dark:bg-slate-900">
            <p className="mb-3 text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Signed in as
            </p>
            <p className="text-base font-semibold text-slate-700 dark:text-slate-100">{user.name}</p>
            {user.email && <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>}
            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-start gap-2 rounded-lg border border-slate-200 px-3 py-2 text-left font-medium text-slate-600 transition hover:border-misty-teal-300 hover:text-misty-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-misty-teal-300 dark:border-slate-700 dark:text-slate-200"
                onClick={() => {
                  setIsOpen(false);
                  // Placeholder for future navigation to user dashboard.
                }}
              >
                Manage trees (soon)
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-misty-teal-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-misty-teal-300 hover:text-misty-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-misty-teal-300 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M15 3H21V9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 14L21 3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 21H3V3H9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Sign in</span>
      </button>
      {/* {isOpen && (
        <form
          onSubmit={handleSubmit}
          className="absolute right-0 z-30 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-5 shadow-ambient dark:border-slate-700 dark:bg-slate-900"
        >
          <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-100">Welcome back</p>
          <div className="mb-3">
            <label htmlFor="login-name" className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Name
            </label>
            <input
              id="login-name"
              name="name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value, error: null }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-misty-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-misty-teal-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              placeholder="Alex Morgan"
              autoComplete="name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="login-email" className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Email (optional)
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value, error: null }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-misty-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-misty-teal-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          {form.error && <p className="mb-3 text-xs font-medium text-red-500">{form.error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setForm(initialForm);
                setIsOpen(false);
              }}
              className="rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-misty-teal-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-misty-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-misty-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-misty-teal-200"
            >
              Continue
            </button>
          </div>
        </form>
        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
          Looking for elevated controls?{" "}
          <a
            href="/admin/login"
            className="font-semibold text-misty-teal-600 underline-offset-2 hover:underline dark:text-misty-teal-300"
          >
            Sign in as admin
          </a>
        </p>
      )} */}
    </div>
  );
}
