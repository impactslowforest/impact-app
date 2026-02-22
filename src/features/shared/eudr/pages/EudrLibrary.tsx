import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Search,
  ShieldCheck,
  FileText,
  ClipboardCheck,
  HelpCircle,
  Scale,
  Leaf,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Globe,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EUDR_ARTICLES } from '../content/eudr-articles';

/** Map icon string names from article data to actual Lucide components */
const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck,
  FileText,
  ClipboardCheck,
  HelpCircle,
  Scale,
  Leaf,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Globe,
  BookOpen,
};

/** Category badge color mapping */
const CATEGORY_COLORS: Record<string, string> = {
  regulation: 'bg-red-100 text-red-700 border-red-200',
  guidance: 'bg-blue-100 text-blue-700 border-blue-200',
  checklist: 'bg-green-100 text-green-700 border-green-200',
  faq: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

/** Category label mapping */
const CATEGORY_LABELS: Record<string, string> = {
  regulation: 'Regulation',
  guidance: 'Guidance',
  checklist: 'Checklist',
  faq: 'FAQ',
};

export default function EudrLibrary() {
  const { t, i18n } = useTranslation(['common']);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const lang = i18n.language as keyof typeof EUDR_ARTICLES[number]['title'];

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return EUDR_ARTICLES;

    const query = searchQuery.toLowerCase();
    return EUDR_ARTICLES.filter((article) => {
      const title = (article.title[lang] || article.title.en).toLowerCase();
      const summary = (article.summary[lang] || article.summary.en).toLowerCase();
      const category = article.category.toLowerCase();
      return title.includes(query) || summary.includes(query) || category.includes(query);
    });
  }, [searchQuery, lang]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2.5">
            <div className="rounded-lg bg-primary-100 p-2">
              <BookOpen className="h-6 w-6 text-primary-700" />
            </div>
            {t('common:eudr_library', 'EUDR Library')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            {t(
              'common:eudr_library_desc',
              'Browse articles about the EU Deforestation Regulation'
            )}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('common:search_articles', 'Search articles...')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-white"
        />
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="h-12 w-12 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground font-medium">
            {t('common:no_articles_found', 'No articles found')}
          </p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            {t('common:try_different_search', 'Try a different search term')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => {
            const IconComponent = ICON_MAP[article.icon] || FileText;
            const title = article.title[lang] || article.title.en;
            const summary = article.summary[lang] || article.summary.en;
            const categoryColor = CATEGORY_COLORS[article.category] || CATEGORY_COLORS.guidance;
            const categoryLabel = CATEGORY_LABELS[article.category] || article.category;

            return (
              <Card
                key={article.id}
                className="card-elevated cursor-pointer group overflow-hidden"
                onClick={() => navigate(`/eudr/article/${article.id}`)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3.5">
                    {/* Icon */}
                    <div className="rounded-lg bg-primary-50 p-2.5 shrink-0 group-hover:bg-primary-100 transition-colors">
                      <IconComponent className="h-5 w-5 text-primary-600" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors">
                          {title}
                        </h3>
                      </div>

                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 mb-2 border ${categoryColor}`}
                      >
                        {categoryLabel}
                      </Badge>

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {summary}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
