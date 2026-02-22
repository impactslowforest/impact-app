import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ModuleCardProps {
  label: string;
  icon: React.ElementType;
  iconBg?: string;
  path: string;
}

export default function ModuleCard({ label, icon: Icon, iconBg, path }: ModuleCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(path)}
      className="flex items-center gap-3.5 w-full glass-card glass-card-hover rounded-2xl px-5 py-4 text-left group"
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg || 'bg-gradient-to-br from-primary-100 to-primary-50'} transition-transform duration-200 group-hover:scale-110`}>
        <Icon className="h-5.5 w-5.5 text-primary-700" />
      </div>
      <span className="flex-1 text-sm font-semibold text-gray-700 leading-tight group-hover:text-gray-900 transition-colors">{label}</span>
      <ArrowRight className="h-4 w-4 shrink-0 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
    </button>
  );
}
