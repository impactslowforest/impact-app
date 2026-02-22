import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, BookOpen, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RA_ARTICLES } from '../content/ra-articles';
import { EU_ORGANIC_ARTICLES } from '../content/eu-organic-articles';
import type { CertArticle } from '../content/ra-articles';

const ALL_ARTICLES: CertArticle[] = [...RA_ARTICLES, ...EU_ORGANIC_ARTICLES];

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
};

const TYPE_LABELS: Record<string, string> = {
  ra: 'Rainforest Alliance',
  eu_organic: 'EU Organic',
};

export default function CertificationArticleViewer() {
  const { t, i18n } = useTranslation(['common']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const lang = i18n.language as keyof CertArticle['title'];
  const article = ALL_ARTICLES.find((a) => a.id === id);

  if (!article) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/certification/library')}
          className="gap-1.5 text-muted-foreground hover:text-foreground no-print"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common:back_to_library', 'Back to Library')}
        </Button>
        <Card className="bg-white">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <FileText className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h2 className="text-lg font-semibold mb-1">
              {t('common:article_not_found', 'Article not found')}
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              {t('common:article_not_found_desc', 'The article you are looking for does not exist or may have been removed.')}
            </p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/certification/library')}>
              <BookOpen className="h-4 w-4 mr-1.5" />
              {t('common:browse_library', 'Browse Library')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const title = article.title[lang] || article.title.en;
  const content = article.content[lang] || article.content.en;
  const categoryColor = CATEGORY_COLORS[article.category] || CATEGORY_COLORS.guidance;
  const categoryLabel = CATEGORY_LABELS[article.category] || article.category;
  const typeColor = TYPE_COLORS[article.type];
  const typeLabel = TYPE_LABELS[article.type];

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between no-print">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/certification/library')}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common:back_to_library', 'Back to Library')}
        </Button>
        <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1.5">
          <Printer className="h-4 w-4" />
          {t('common:print', 'Print')}
        </Button>
      </div>

      {/* Article card */}
      <Card className="bg-white">
        <CardContent className="p-6 sm:p-8 lg:p-10">
          <div className="mb-6 pb-6 border-b border-primary-100">
            <div className="flex items-center gap-2.5 mb-3">
              <div className={`rounded-lg p-2 ${article.type === 'ra' ? 'bg-amber-50' : 'bg-green-50'}`}>
                <BookOpen className={`h-5 w-5 ${article.type === 'ra' ? 'text-amber-600' : 'text-green-600'}`} />
              </div>
              <Badge variant="outline" className={`text-xs border ${typeColor}`}>
                {typeLabel}
              </Badge>
              <Badge variant="outline" className={`text-xs border ${categoryColor}`}>
                {categoryLabel}
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary-900 leading-tight">
              {title}
            </h1>
          </div>

          <div
            className="article-content text-sm sm:text-base"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
