import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import ModuleCard from './ModuleCard';

export interface HubCardConfig {
  label: string;
  icon: React.ElementType;
  iconBg?: string;
  path: string;
}

export interface HubSection {
  title: string;
  icon: React.ElementType;
  color?: string;
  cards: HubCardConfig[];
}

interface ModuleHubProps {
  title: string;
  breadcrumb?: string[];
  sections: HubSection[];
}

export default function ModuleHub({ title, breadcrumb = [], sections }: ModuleHubProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 page-enter">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[13px] text-gray-400">
        <button
          type="button"
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="flex items-center gap-1 hover:text-primary-600 transition-colors text-gray-500"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </button>
        <ChevronRight className="h-3 w-3" />
        {breadcrumb.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="text-gray-400">{crumb}</span>
            {i < breadcrumb.length - 1 && <ChevronRight className="h-3 w-3" />}
          </span>
        ))}
        {breadcrumb.length > 0 && <ChevronRight className="h-3 w-3" />}
        <span className="font-semibold text-gray-700">{title}</span>
      </div>

      {/* Sections */}
      {sections.map((section, sIdx) => {
        const SectionIcon = section.icon;
        const color = section.color || 'text-green-700';

        return (
          <div key={sIdx} className="space-y-3">
            {/* Section Header */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50">
                <SectionIcon className={`h-4 w-4 ${color}`} />
              </div>
              <h2 className={`text-[15px] font-bold ${color}`}>
                {sIdx + 1}. {section.title}
              </h2>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {section.cards.map((card, cIdx) => (
                <ModuleCard
                  key={cIdx}
                  label={card.label}
                  icon={card.icon}
                  iconBg={card.iconBg}
                  path={card.path}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
