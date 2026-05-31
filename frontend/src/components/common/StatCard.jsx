export const StatCard = ({ label, value, icon: Icon, trend }) => (
  <div className="group rounded-2xl border border-border bg-surface/90 p-5 shadow-sm backdrop-blur-sm transition hover:border-primary/25 hover:shadow-md hover:shadow-primary/10 dark:bg-surface/80">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted">{label}</p>
        <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
        {trend && <p className="mt-1 text-xs text-success">{trend}</p>}
      </div>
      {Icon && (
        <div className="rounded-xl bg-gradient-brand p-2.5 text-white shadow-glow">
          <Icon size={22} />
        </div>
      )}
    </div>
  </div>
);
