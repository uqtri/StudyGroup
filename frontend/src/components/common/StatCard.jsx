export const StatCard = ({ label, value, icon: Icon, trend }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-bold text-text">{value}</p>
        {trend && <p className="mt-1 text-xs text-success">{trend}</p>}
      </div>
      {Icon && (
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <Icon size={22} />
        </div>
      )}
    </div>
  </div>
);
