import { motion } from "motion/react";

const TONES = {
  rose: "bg-rose-50 text-rose-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
  violet: "bg-violet-50 text-violet-600",
  slate: "bg-slate-100 text-slate-600",
};

export default function StatCard({ icon: Icon, value, label, sub, tone = "slate", link }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
    >
      <div className="flex items-start gap-3.5">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${TONES[tone]}`}>
          <Icon size={20} strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-semibold leading-none text-slate-900">{value}</p>
          <p className="mt-1.5 text-sm font-medium text-slate-700">{label}</p>
          {sub && <p className="text-xs text-slate-400">{sub}</p>}
        </div>
      </div>
      {link && (
        <a href={link.href ?? "#"} className={`mt-3 inline-block text-xs font-semibold ${TONES[tone].split(" ")[1]} hover:underline`}>
          {link.label} &rarr;
        </a>
      )}
    </motion.div>
  );
}
