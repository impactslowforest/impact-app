import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
  trend?: { value: number; label: string };
  onClick?: () => void;
}

export function KpiCard({ title, value, subtitle, icon: Icon, color = 'text-primary-600', trend, onClick }: KpiCardProps) {
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 relative overflow-hidden hover:shadow-md transition-all duration-200 group kpi-pattern text-left w-full ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 truncate">{title}</p>
          <p className={`mt-2 text-3xl font-extrabold tracking-tight ${color}`}>{value}</p>
          {subtitle && <p className="mt-1 text-[12px] text-gray-400">{subtitle}</p>}
          {trend && (
            <span className={`inline-flex items-center mt-2 rounded-full px-2.5 py-0.5 text-xs font-bold ${trend.value >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
              {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
            </span>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50/80 ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Wrapper>
  );
}
