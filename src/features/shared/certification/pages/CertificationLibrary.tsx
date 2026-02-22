import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Search, FileText, ClipboardCheck, HelpCircle,
  Award, Leaf, Users, Clock, Sprout,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RA_ARTICLES } from '../content/ra-articles';
import { EU_ORGANIC_ARTICLES } from '../content/eu-organic-articles';
import { FT_ARTICLES } from '../content/fairtrade-articles';
import { BF_ARTICLES } from '../content/birdfriendly-articles';
import { EUDR_ARTICLES } from '../content/eudr-articles';
import type { CertArticle } from '../content/ra-articles';

const ICON_MAP: Record<string, LucideIcon> = {
  Award, Leaf, Users, ClipboardCheck, HelpCircle, FileText, Clock, Sprout, BookOpen, Search,
};

const CATEGORY_COLORS: Record<string, string> = {
  standard: 'bg-purple-100 text-purple-700 border-purple-200',
  guidance: 'bg-blue-100 text-blue-700 border-blue-200',
  checklist: 'bg-green-100 text-green-700 border-green-200',
  faq: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

const CATEGORY_LABELS: Record<string, string> = {
  standard: 'Standard',
  guidance: 'Guidance',
  checklist: 'Checklist',
  faq: 'FAQ',
};

const TYPE_COLORS: Record<string, string> = {
  ra: 'bg-amber-100 text-amber-700 border-amber-200',
  eu_organic: 'bg-green-100 text-green-700 border-green-200',
  fairtrade: 'bg-teal-100 text-teal-700 border-teal-200',
  birdfriendly: 'bg-sky-100 text-sky-700 border-sky-200',
  eudr: 'bg-red-100 text-red-700 border-red-200',
};

const TYPE_LABELS: Record<string, string> = {
  ra: 'Rainforest Alliance',
  eu_organic: 'EU Organic',
  fairtrade: 'FairTrade',
  birdfriendly: 'Bird Friendly',
  eudr: 'EUDR',
};

const ALL_ARTICLES: CertArticle[] = [...RA_ARTICLES, ...EU_ORGANIC_ARTICLES, ...FT_ARTICLES, ...BF_ARTICLES, ...EUDR_ARTICLES];

type FilterType = 'all' | 'ra' | 'eu_organic' | 'fairtrade' | 'birdfriendly' | 'eudr';

export default function CertificationLibrary() {
  const { t, i18n } = useTranslation(['common']);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');

  const lang = i18n.language as keyof CertArticle['title'];

  const filteredArticles = useMemo(() => {
    let articles = ALL_ARTICLES;

    if (typeFilter !== 'all') {
      articles = articles.filter((a) => a.type === typeFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      articles = articles.filter((article) => {
        const title = (article.title[lang] || article.title.en).toLowerCase();
        const summary = (article.summary[lang] || article.summary.en).toLowerCase();
        return title.includes(query) || summary.includes(query) || article.category.includes(query);
      });
    }

    return articles;
  }, [searchQuery, typeFilter, lang]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2.5">
            <div className="rounded-lg bg-primary-100 p-2">
              <BookOpen className="h-6 w-6 text-primary-700" />
            </div>
            {t('common:certification_library', 'Certification Library')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            {t('common:cert_library_desc', 'Browse articles about RA and EU Organic certification standards')}
          </p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('common:search_articles', 'Search articles...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'ra', 'eu_organic', 'fairtrade', 'birdfriendly', 'eudr'] as const).map((filter) => (
            <Button
              key={filter}
              variant={typeFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter(filter)}
              className="text-xs"
            >
              {filter === 'all' ? t('common:all', 'All') : TYPE_LABELS[filter]}
            </Button>
          ))}
        </div>
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
            const typeColor = TYPE_COLORS[article.type];
            const typeLabel = TYPE_LABELS[article.type];

            return (
              <Card
                key={article.id}
                className="card-elevated cursor-pointer group overflow-hidden"
                onClick={() => navigate(`/certification/article/${article.id}`)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3.5">
                    <div className={`rounded-lg p-2.5 shrink-0 group-hover:opacity-90 transition-opacity ${
                      { ra: 'bg-amber-50', eu_organic: 'bg-green-50', fairtrade: 'bg-teal-50', birdfriendly: 'bg-sky-50', eudr: 'bg-red-50' }[article.type] || 'bg-gray-50'
                    }`}>
                      <IconComponent className={`h-5 w-5 ${
                        { ra: 'text-amber-600', eu_organic: 'text-green-600', fairtrade: 'text-teal-600', birdfriendly: 'text-sky-600', eudr: 'text-red-600' }[article.type] || 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors mb-1.5">
                        {title}
                      </h3>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 border ${typeColor}`}>
                          {typeLabel}
                        </Badge>
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 border ${categoryColor}`}>
                          {categoryLabel}
                        </Badge>
                      </div>
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
