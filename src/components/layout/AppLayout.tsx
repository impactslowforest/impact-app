import { useEffect, lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';
import { useUIStore } from '@/stores/ui-store';
import { useTheme } from '@/hooks/useTheme';

const AiChatbot = lazy(() => import('@/components/shared/AiChatbot'));

export function AppLayout() {
  const fontSize = useUIStore((s) => s.fontSize);
  const { meshPrimary, meshAccent, bodyBg } = useTheme();

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className={`relative overflow-hidden ${bodyBg}`}>
        {/* Background Decorative Mesh — Theme-aware */}
        <div className={`absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] ${meshPrimary} rounded-full blur-[120px] pointer-events-none`} />
        <div className={`absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] ${meshAccent} rounded-full blur-[100px] pointer-events-none`} />

        <Header />
        <main className="flex-1 overflow-auto p-5 md:p-8 relative z-10">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
      <Suspense fallback={null}>
        <AiChatbot />
      </Suspense>
    </SidebarProvider>
  );
}
