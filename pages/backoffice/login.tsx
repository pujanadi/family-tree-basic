import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";

const BACKOFFICE_USERNAME = process.env.NEXT_PUBLIC_BACKOFFICE_USERNAME ?? "admin";
const BACKOFFICE_PASSWORD = process.env.NEXT_PUBLIC_BACKOFFICE_PASSWORD ?? "family-secret";

const BackofficeLoginPage = () => {
  const router = useRouter();
  const { user, login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTarget = useMemo(() => {
    const redirect = router.query.redirectTo;
    if (typeof redirect === "string" && redirect.trim() && redirect !== router.pathname) {
      return redirect;
    }
    return "/backoffice";
  }, [router.pathname, router.query.redirectTo]);

  if (user?.role === "admin") {
    void router.replace(redirectTarget);
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setError("Enter your username and password.");
      return;
    }

    if (trimmedUsername !== BACKOFFICE_USERNAME || trimmedPassword !== BACKOFFICE_PASSWORD) {
      setError("Invalid credentials.");
      return;
    }

    try {
      setIsSubmitting(true);
      login({
        name: trimmedUsername,
        role: "admin"
      });
      void router.replace(redirectTarget);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Backoffice Sign In · Family Tree</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-100">
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-10 shadow-2xl backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-misty-teal-200">Backoffice</p>
            <h1 className="mt-3 text-3xl font-semibold">Administrator access</h1>
            <p className="mt-2 text-sm text-slate-300">
              Sign in with your assigned credentials to manage secure family archives and exports.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label htmlFor="backoffice-username" className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-300">
                  Username
                </label>
                <input
                  id="backoffice-username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  className="w-full rounded-xl border border-white/10 bg-white/20 px-4 py-3 text-sm text-white placeholder-white/60 focus:border-misty-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-misty-teal-300"
                  placeholder="admin"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="backoffice-password" className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-300">
                  Password
                </label>
                <input
                  id="backoffice-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-white/10 bg-white/20 px-4 py-3 text-sm text-white placeholder-white/60 focus:border-misty-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-misty-teal-300"
                  placeholder="••••••••"
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-misty-teal-500 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-misty-teal-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-misty-teal-200 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-misty-teal-950/30 disabled:text-slate-400"
              >
                {isSubmitting ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="rounded-full px-3 py-1 text-slate-300 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-misty-teal-200"
              >
                Return to app
              </button>
              <span>Contact support if you forgot your credentials.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BackofficeLoginPage;
