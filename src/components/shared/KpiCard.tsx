import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
  trend?: { value: number; label: string };
}

export function KpiCard({ title, value, subtitle, icon: Icon, color = 'text-primary-600', trend }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-gray-400 truncate">{title}</p>
          <p className={`mt-1.5 text-2xl font-extrabold ${color}`}>{value}</p>
          {subtitle && <p className="mt-1 text-[12px] text-gray-400">{subtitle}</p>}
          {trend && (
            <p className={`mt-1.5 text-[12px] font-semibold ${trend.value >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
            </p>
          )}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 ${color} group-hover:scale-105 transition-transform`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
