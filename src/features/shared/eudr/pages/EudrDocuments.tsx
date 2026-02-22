import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Upload, Download, Trash2, ExternalLink, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import pb from '@/config/pocketbase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface EudrDocumentsProps {
  country?: string;
}

const CATEGORIES = ['regulation', 'guidance', 'training', 'faq', 'checklist', 'report', 'other'];

const categoryColors: Record<string, string> = {
  regulation: 'bg-red-100 text-red-700',
  guidance: 'bg-blue-100 text-blue-700',
  training: 'bg-purple-100 text-purple-700',
  faq: 'bg-yellow-100 text-yellow-700',
  checklist: 'bg-green-100 text-green-700',
  report: 'bg-orange-100 text-orange-700',
  other: 'bg-gray-100 text-gray-700',
};

export function EudrDocuments({ country }: EudrDocumentsProps) {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);

  const buildFilter = () => {
    const parts: string[] = [];
    if (country) parts.push(`country = "${country}" || country = "global"`);
    if (search) parts.push(`title ~ "${search}" || description ~ "${search}"`);
    if (categoryFilter && categoryFilter !== 'all') parts.push(`category = "${categoryFilter}"`);
    return parts.length > 0 ? parts.join(' && ') : undefined;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['eudr-documents', country, search, categoryFilter],
    queryFn: () => pb.collection('eudr_documents').getList(1, 50, {
      filter: buildFilter(),
      sort: '-created',
    }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => pb.collection('eudr_documents').delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eudr-documents'] });
      toast.success(t('deleted'));
    },
  });

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set('uploaded_by', user?.id || '');
    formData.set('is_active', 'true');
    if (!formData.get('country')) formData.set('country', country || 'global');

    try {
      await pb.collection('eudr_documents').create(formData);
      queryClient.invalidateQueries({ queryKey: ['eudr-documents'] });
      toast.success(t('saved'));
      setDialogOpen(false);
      form.reset();
    } catch {
      toast.error(t('error'));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('eudr_documents')}
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Upload className="mr-2 h-4 w-4" />{t('upload')}</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{t('upload_document')}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>{t('title')} *</Label>
                  <Input name="title" required />
                </div>
                <div className="space-y-1.5">
                  <Label>{t('description')}</Label>
                  <Input name="description" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>{t('category')} *</Label>
                    <select name="category" required className="w-full rounded-md border px-3 py-2 text-sm">
                      {CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('country')}</Label>
                    <select name="country" className="w-full rounded-md border px-3 py-2 text-sm" defaultValue={country || 'global'}>
                      <option value="global">Global</option>
                      <option value="indonesia">Indonesia</option>
                      <option value="vietnam">Vietnam</option>
                      <option value="laos">Laos</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>{t('file')}</Label>
                  <Input name="file" type="file" accept=".pdf,.docx,.xlsx,.pptx" />
                </div>
                <div className="space-y-1.5">
                  <Label>{t('external_url')}</Label>
                  <Input name="external_url" type="url" placeholder="https://..." />
                </div>
                <Button type="submit" className="w-full">{t('save')}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-2 sm:flex-row mt-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t('all_categories')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all')}</SelectItem>
              {CATEGORIES.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : !data?.items.length ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>{t('no_documents')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.items.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50">
                <div className="shrink-0">
                  <FileText className="h-8 w-8 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{doc.title}</p>
                  {doc.description && (
                    <p className="text-xs text-muted-foreground truncate">{doc.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`text-xs ${categoryColors[doc.category] || ''}`}>{doc.category}</Badge>
                    <Badge variant="outline" className="text-xs capitalize">{doc.country}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {doc.file && (
                    <Button
                      variant="ghost" size="icon" className="h-8 w-8"
                      onClick={() => window.open(pb.files.getURL(doc, doc.file), '_blank')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  {doc.external_url && (
                    <Button
                      variant="ghost" size="icon" className="h-8 w-8"
                      onClick={() => window.open(doc.external_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700"
                    onClick={() => deleteMutation.mutate(doc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
