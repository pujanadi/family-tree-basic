export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  icon?: (props: { className?: string }) => JSX.Element;
}

interface RecentActivityProps {
  items: ActivityItem[];
}

const RecentActivity = ({ items }: RecentActivityProps) => (
  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-slate-950/40 backdrop-blur">
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-white">Recent activity</h2>
        <p className="text-sm text-slate-400">Latest actions performed across the workspace.</p>
      </div>
      <button
        type="button"
        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:border-misty-teal-300 hover:text-misty-teal-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-misty-teal-300"
      >
        View all
      </button>
    </div>
    <ul className="space-y-3 text-sm">
      {items.map((item) => (
        <li key={item.id} className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/5 p-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-misty-teal-500/15 text-misty-teal-200">
            {item.icon ? (
              <item.icon className="h-4 w-4" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M5 13 11 7l2 2 6-6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 19h14" strokeLinecap="round" />
              </svg>
            )}
          </span>
          <div className="flex-1">
            <p className="font-medium text-white">
              {item.actor} <span className="font-normal text-slate-300">{item.action}</span>{" "}
              <span className="font-semibold text-white">{item.target}</span>
            </p>
            <p className="text-xs uppercase tracking-wide text-slate-500">{item.timestamp}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default RecentActivity;
