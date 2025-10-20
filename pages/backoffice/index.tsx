import Head from "next/head";
import BackofficeLayout from "@/components/backoffice/BackofficeLayout";
import KpiCard from "@/components/backoffice/KpiCard";
import RecentActivity, { type ActivityItem } from "@/components/backoffice/RecentActivity";

const kpiItems = [
  {
    label: "Total Trees",
    value: "128",
    delta: { value: "+6.4%", positive: true, description: "vs last 7 days" }
  },
  {
    label: "Unique People",
    value: "4,982",
    delta: { value: "+312", positive: true, description: "added this month" }
  },
  {
    label: "Exports (24h)",
    value: "42",
    delta: { value: "-8%", positive: false, description: "vs previous day" }
  },
  {
    label: "Errors (24h)",
    value: "3",
    delta: { value: "-2", positive: true, description: "resolved overnight" }
  }
];

const activity: ActivityItem[] = [
  {
    id: "1",
    actor: "Jasmin Ortega",
    action: "approved",
    target: "Hart Family Tree export",
    timestamp: "3 minutes ago"
  },
  {
    id: "2",
    actor: "Lincoln Chen",
    action: "imported",
    target: "Chen Archive (GEDCOM)",
    timestamp: "1 hour ago"
  },
  {
    id: "3",
    actor: "Marta Sánchez",
    action: "invited",
    target: "2 collaborators",
    timestamp: "yesterday"
  },
  {
    id: "4",
    actor: "Automations",
    action: "cleaned",
    target: "stale exports (5)",
    timestamp: "2 days ago"
  }
];

const recentExports = [
  {
    id: "exp-241",
    tree: "Hart Family Tree",
    format: "PNG",
    status: "Ready",
    size: "3.2 MB",
    requestedBy: "Jasmin Ortega",
    requestedAt: "2025-10-18 10:14"
  },
  {
    id: "exp-238",
    tree: "Chen-Patel Lineage",
    format: "SVG",
    status: "Processing",
    size: "—",
    requestedBy: "Lincoln Chen",
    requestedAt: "2025-10-18 09:48"
  },
  {
    id: "exp-233",
    tree: "Patel Archive",
    format: "PNG",
    status: "Failed",
    size: "—",
    requestedBy: "Automations",
    requestedAt: "2025-10-17 19:02"
  }
];

const OverviewPage = () => (
  <>
    <Head>
      <title>Backoffice · Overview</title>
    </Head>
    <BackofficeLayout
      title="Overview"
      subtitle="Monitor the health of your family history workspace."
      actions={
        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-misty-teal-200 transition hover:border-misty-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-misty-teal-300"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 12h14" strokeLinecap="round" />
              <path d="M12 5v14" strokeLinecap="round" />
            </svg>
            New tree
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl border border-misty-teal-300 bg-misty-teal-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-misty-teal-200 transition hover:bg-misty-teal-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-misty-teal-300"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 7h16" strokeLinecap="round" />
              <path d="M4 12h10" strokeLinecap="round" />
              <path d="M4 17h7" strokeLinecap="round" />
            </svg>
            Export queue
          </button>
        </div>
      }
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiItems.map((item) => (
          <KpiCard key={item.label} {...item} />
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-950/40 backdrop-blur">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Exports activity</h2>
                <p className="text-sm text-slate-400">Latest export jobs requested across all trees.</p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:border-misty-teal-300 hover:text-misty-teal-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-misty-teal-300"
              >
                View exports
              </button>
            </div>
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/5">
              <table className="min-w-full divide-y divide-white/5 text-sm">
                <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Tree</th>
                    <th className="px-4 py-3">Format</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Size</th>
                    <th className="px-4 py-3">Requested by</th>
                    <th className="px-4 py-3">Requested at</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {recentExports.map((exportJob) => (
                    <tr key={exportJob.id} className="hover:bg-white/5">
                      <td className="px-4 py-3 font-medium text-white">{exportJob.tree}</td>
                      <td className="px-4 py-3 text-slate-300">{exportJob.format}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            exportJob.status === "Ready"
                              ? "bg-misty-teal-500/15 text-misty-teal-200"
                              : exportJob.status === "Failed"
                              ? "bg-red-500/20 text-red-200"
                              : "bg-amber-500/10 text-amber-200"
                          }`}
                        >
                          {exportJob.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{exportJob.size}</td>
                      <td className="px-4 py-3 text-slate-300">{exportJob.requestedBy}</td>
                      <td className="px-4 py-3 text-slate-300">{exportJob.requestedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <RecentActivity items={activity} />
      </section>
    </BackofficeLayout>
  </>
);

export default OverviewPage;
