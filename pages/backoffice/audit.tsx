import Head from "next/head";
import BackofficeLayout from "@/components/backoffice/BackofficeLayout";

const AuditPage = () => (
  <>
    <Head>
      <title>Backoffice · Audit log</title>
    </Head>
    <BackofficeLayout title="Audit log" subtitle="Trace actions across the platform for compliance and review.">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-sm text-slate-400">
        The audit log will display a chronological feed of admin and automation actions with filters for actor, scope,
        and outcome.
      </div>
    </BackofficeLayout>
  </>
);

export default AuditPage;
