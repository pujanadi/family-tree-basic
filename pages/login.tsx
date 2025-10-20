import React from 'react';
import { getProviders, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function LoginPage({ providers }: any) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-2">Sign in</h1>
        <p className="text-sm text-slate-500 mb-4">Sign in to save and manage your family trees.</p>

        <div className="space-y-3">
          {providers && Object.values(providers).map((p: any) => (
            <div key={p.name}>
              <button
                onClick={() => signIn(p.id, { callbackUrl: router.query.redirectTo || '/' })}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border rounded hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <span>Sign in with {p.name}</span>
              </button>
            </div>
          ))}

          {/* Demo login (no backend) */}
          <div>
            <button
              onClick={() => {
                if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
                  // create a local demo session (store in localStorage) and redirect
                  localStorage.setItem('demo-session', JSON.stringify({ id: 'demo', name: 'Demo User' }));
                  router.push('/');
                } else {
                  // fallback: redirect to OAuth sign in
                  router.push('/');
                }
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Continue as demo
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-4">By signing in you agree to the privacy policy.</p>
      </div>
    </div>
  );
}

// Server-side: fetch providers and pass to page
export async function getServerSideProps(context: any) {
  try {
    const providers = await getProviders();
    return { props: { providers } };
  } catch (err) {
    return { props: { providers: [] } };
  }
}
