export const StatCard = ({ label, value, icon: Icon, trend }) => (
  <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-soft transition hover:border-primary/15">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-muted">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">{value}</p>
        {trend && <p className="mt-1 text-xs font-medium text-success">{trend}</p>}
      </div>
      {Icon && (
        <div className="rounded-[var(--radius-control)] bg-primary/10 p-2.5 text-primary">
          <Icon size={22} strokeWidth={1.75} />
        </div>
      )}
    </div>
  </div>
);
