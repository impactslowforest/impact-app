import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { router } from '@/router/routes';
import AiChatBot from '@/components/shared/AiChatBot';
import { useUIStore } from '@/stores/ui-store';
import { applyTheme } from '@/config/themes';

import '@/config/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const themeColor = useUIStore((s) => s.themeColor);

  // Apply theme CSS variables on mount and when theme changes
  useEffect(() => {
    applyTheme(themeColor);
  }, [themeColor]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <AiChatBot />
          <Toaster position="top-right" offset="60px" expand richColors />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
