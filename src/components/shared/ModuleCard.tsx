import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ModuleCardProps {
  label: string;
  icon: React.ElementType;
  iconBg?: string;
  path: string;
}

export default function ModuleCard({ label, icon: Icon, iconBg = 'bg-primary-50', path }: ModuleCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(path)}
      className="flex items-center gap-3.5 w-full rounded-xl border border-gray-100 bg-white px-4 py-3.5 text-left shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary-200 hover:bg-primary-50/20 group"
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg} transition-transform duration-200 group-hover:scale-105`}>
        <Icon className="h-5.5 w-5.5 text-primary-700" />
      </div>
      <span className="flex-1 text-[13px] font-semibold text-gray-700 leading-tight group-hover:text-gray-900 transition-colors">{label}</span>
      <ArrowRight className="h-4 w-4 shrink-0 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
    </button>
  );
}
