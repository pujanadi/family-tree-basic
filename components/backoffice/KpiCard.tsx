interface KpiCardProps {
  label: string;
  value: string | number;
  icon?: (props: { className?: string }) => JSX.Element;
  delta?: {
    value: string;
    positive?: boolean;
    description?: string;
  };
}

const KpiCard = ({ label, value, icon: Icon, delta }: KpiCardProps) => (
  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-slate-950/40 backdrop-blur">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">{label}</p>
        <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
        {delta && (
          <p
            className={`mt-2 text-xs font-medium ${
              delta.positive ? "text-misty-teal-300" : "text-red-300"
            }`}
          >
            {delta.value}
            {delta.description ? <span className="ml-2 text-slate-400">{delta.description}</span> : null}
          </p>
        )}
      </div>
      {Icon && (
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-misty-teal-500/15 text-misty-teal-200">
          <Icon className="h-6 w-6" />
        </span>
      )}
    </div>
  </div>
);

export default KpiCard;
