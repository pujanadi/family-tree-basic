import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useCallback } from "react";

interface ProviderInfo {
  id: string;
  name: string;
  signinUrl: string;
  type: string;
}

type LoginPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function LoginPage({ providers }: LoginPageProps) {
  const router = useRouter();
  const redirectTo = router.query.redirectTo;
  const callbackUrl = Array.isArray(redirectTo) ? redirectTo[0] : redirectTo;

  const handleProviderSignIn = useCallback(
    (provider: ProviderInfo) => {
      const signInUrl = new URL(`/api/auth/signin/${provider.id}`, window.location.origin);
      if (callbackUrl) {
        signInUrl.searchParams.set("callbackUrl", callbackUrl);
      }
      window.location.href = signInUrl.toString();
    },
    [callbackUrl]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-2">Sign in</h1>
        <p className="text-sm text-slate-500 mb-4">Sign in to save and manage your family trees.</p>

        <div className="space-y-3">
          {providers.map((provider) => (
            <div key={provider.id}>
              <button
                type="button"
                onClick={() => handleProviderSignIn(provider)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border rounded hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <span>Sign in with {provider.name}</span>
              </button>
            </div>
          ))}

          <div>
            <button
              type="button"
              onClick={() => {
                if (typeof window === "undefined") {
                  return;
                }
                if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
                  window.localStorage.setItem("demo-session", JSON.stringify({ id: "demo", name: "Demo User" }));
                  void router.push("/");
                } else {
                  void router.push("/");
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const protocol = (context.req.headers["x-forwarded-proto"] as string | undefined) ?? "http";
  const host = context.req.headers.host ?? "localhost:3000";
  const baseUrl = `${protocol}://${host}`;

  try {
    const response = await fetch(`${baseUrl}/api/auth/providers`, {
      headers: {
        cookie: context.req.headers.cookie ?? ""
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to load providers (${response.status})`);
    }

    const data = (await response.json()) as Record<string, ProviderInfo>;
    const providers = Object.values(data ?? {});

    return { props: { providers } };
  } catch (error) {
    console.warn("Failed to load auth providers", error);
    return { props: { providers: [] as ProviderInfo[] } };
  }
}
