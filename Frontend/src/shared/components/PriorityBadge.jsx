const STYLES = {
  High: "bg-rose-50 text-rose-700",
  Medium: "bg-amber-50 text-amber-700",
  Low: "bg-slate-100 text-slate-600",
};

export default function PriorityBadge({ level }) {
  return (
    <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${STYLES[level] ?? STYLES.Low}`}>
      {level}
    </span>
  );
}
