const STYLES = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  returned: "bg-rose-50 text-rose-700 ring-rose-200",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  draft: "bg-blue-50 text-blue-700 ring-blue-200",
  rcp: "bg-blue-50 text-blue-700 ring-blue-200",
  hod: "bg-violet-50 text-violet-700 ring-violet-200",
  dean: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  accounts: "bg-teal-50 text-teal-700 ring-teal-200",
  default: "bg-slate-100 text-slate-600 ring-slate-200",
};

export default function StatusBadge({ status, children }) {
  const style = STYLES[status] ?? STYLES.default;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style}`}
    >
      {children}
    </span>
  );
}
