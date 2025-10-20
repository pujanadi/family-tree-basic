import Head from "next/head";
import BackofficeLayout from "@/components/backoffice/BackofficeLayout";

const SettingsPage = () => (
  <>
    <Head>
      <title>Backoffice · Settings</title>
    </Head>
    <BackofficeLayout
      title="Settings"
      subtitle="Configure themes, feature flags, and integrations (read-only for MVP)."
    >
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-sm text-slate-400">
        Settings panels will arrive soon. Expect controls for theme defaults, export retention, and advanced toggles.
      </div>
    </BackofficeLayout>
  </>
);

export default SettingsPage;
