import Head from "next/head";
import BackofficeLayout from "@/components/backoffice/BackofficeLayout";

const ExportsPage = () => (
  <>
    <Head>
      <title>Backoffice · Export history</title>
    </Head>
    <BackofficeLayout
      title="Export history"
      subtitle="Track generated files, rerun jobs, and inspect failures."
    >
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-sm text-slate-400">
        Export monitoring UI is under construction. For now, review recent activity from the overview dashboard.
      </div>
    </BackofficeLayout>
  </>
);

export default ExportsPage;
